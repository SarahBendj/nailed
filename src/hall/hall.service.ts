import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { findNearbyHalls } from 'utility/GPS';
import { HallGpsDto } from './dto/hall.dto';
import { R2Service } from 'src/r2/r2.service';
import { PrismaService } from 'src/prisma';
import { HallType } from '@prisma/client';

@Injectable()
export class HallService {
  constructor(
    private readonly r2Service: R2Service,
    private readonly prisma: PrismaService,
  ) {}

  async getAllHalls() {
    const halls = await this.prisma.hall.findMany({
      include: { images: true },
    });
    if (!halls || halls.length === 0) {
      return [];
    }

    const signed = await Promise.all(
      halls.map(async (hall) => ({
        ...hall,
        images: await Promise.all(
          hall.images.map(async (img) => ({
            ...img,
            url: await this.r2Service.getSignedUrl(img.key),
          })),
        ),
      })),
    );

    return signed;
  }

  async createHall(userId: string, data: any, files?: Express.Multer.File[]) {
    if (!userId) {
      throw new UnauthorizedException('USER_NOT_AUTHENTICATED');
    }
    if (!files || files.length === 0) {
      throw new BadRequestException('AT_LEAST_ONE_IMAGE_REQUIRED');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!existingUser) {
      throw new BadRequestException('User does not exist');
    }

    try {
      const newHall = await this.prisma.hall.create({
        data: {
          ownerId: Number(userId),
          name: data.name,
          description: data.description ?? null,
          wilaya: data.wilaya ?? null,
          commune: data.commune ?? null,
          address: data.address ?? null,
          capacity: data.capacity ?? null,
          type: (data.type as HallType) ?? HallType.SALLE,
          priceDay: data.price_day ?? null,
          intervalDayFrom: data.interval_day_from ?? null,
          intervalDayTo: data.interval_day_to ?? null,
          priceEvening: data.price_evening ?? null,
          intervalEveningFrom: data.interval_evening_from ?? null,
          intervalEveningTo: data.interval_evening_to ?? null,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          hallServices: data.hall_services ?? [],
        },
      });

      if (files?.length) {
        const keys = await this.r2Service.uploadFiles(
          files,
          'hall',
          newHall.id.toString(),
        );
        const baseUrl =
          process.env.R2_DISPLAY_PUBLIC_URL?.replace(/\/$/, '') || '';
        await this.prisma.hallImage.createMany({
          data: keys.map((key, position) => ({
            hallId: newHall.id,
            key,
            url: baseUrl ? `${baseUrl}/${key}` : null,
            position,
            isCover: position === 0,
          })),
        });
      }

      const created = await this.prisma.hall.findUnique({
        where: { id: newHall.id },
        include: { images: true },
      });
      const hallWithUrls = created
        ? {
            ...created,
            images: await Promise.all(
              created.images.map(async (img) => ({
                ...img,
                url: await this.r2Service.getSignedUrl(img.key),
              })),
            ),
          }
        : newHall;
      return { message: 'HALL_CREATED', hall: hallWithUrls };
    } catch (error) {
      console.error('Error during transaction:', error);
      throw new BadRequestException('HALL_CREATION_FAILED');
    }
  }

  async getHallById(id: number) {
    try {
      const halls = await this.prisma.hall.findMany({
        where: { ownerId: id },
        include: { images: true },
      });
      if (!halls || halls.length === 0) {
        return [];
      }
      return Promise.all(
        halls.map(async (hall) => ({
          ...hall,
          images: await Promise.all(
            hall.images.map(async (img) => ({
              ...img,
              url: await this.r2Service.getSignedUrl(img.key),
            })),
          ),
        })),
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des halls:', error);
      return [];
    }
  }

  async nearestHalls(data: HallGpsDto) {
    const halls = await this.prisma.hall.findMany();
    if (!halls || halls.length === 0) {
      return [];
    }
    return findNearbyHalls(
      data.latitude,
      data.longitude,
      data.distance,
      halls,
    );
  }

  async getBestRated() {
    const salons = await this.prisma.hall.findMany({
      where: { isActive: true },
      orderBy: { ratingAvg: 'desc' },
      take: 20,
    });
    if (!salons || salons.length === 0) {
      return [];
    }
    return salons;
  }

  async desactivateSalon(id: number) {
    const salon = await this.prisma.hall.findUnique({
      where: { id },
    });
    if (!salon) {
      return { message: 'No salon found for the given id.', results: [] };
    }
    const updated = await this.prisma.hall.update({
      where: { id },
      data: { isActive: false },
    });
    return updated;
  }

  async deleteSalon(id: number, _password: string) {
    const salon = await this.prisma.hall.findUnique({
      where: { id },
    });
    if (!salon) {
      return { message: 'No salon found for the given id.', results: [] };
    }
    await this.prisma.hall.delete({
      where: { id },
    });
    return { message: 'Salon deleted successfully' };
  }

  async deleteImage(userId: number, imageId: number) {
    if(!userId) {
      throw new UnauthorizedException('USER_NOT_AUTHENTICATED');
    }
    if(!imageId) {
      throw new BadRequestException('IMAGE_ID_REQUIRED');
    }
    const image = await this.prisma.hallImage.findFirst({
      where: { id: imageId, hall: { ownerId: userId } },
    });
    if (!image) {
      throw new BadRequestException('IMAGE_NOT_FOUND');
    }

    const key = image.key;
    if (!key) {
      throw new BadRequestException('IMAGE_KEY_MISSING');
    }
    await this.r2Service.deleteFile(key);
    await this.prisma.hallImage.delete({
      where: { id: image.id },
    });
    return { message: 'IMAGE_DELETED' };
  }

  async addImage(userId: number, hallId: number, file: Express.Multer.File) {
    if (!userId) {
      throw new UnauthorizedException('USER_NOT_AUTHENTICATED');
    }
    if (!file) {
      throw new BadRequestException('IMAGE_REQUIRED');
    }
    const hall = await this.prisma.hall.findFirst({
      where: { id: hallId, ownerId: userId },
    });
    if (!hall) {
      throw new BadRequestException('HALL_NOT_FOUND_OR_NOT_OWNER');
    }
    const keys = await this.r2Service.uploadFiles(
      [file],
      'hall',
      hallId.toString(),
    );
    if (!keys?.length) {
      throw new BadRequestException('IMAGE_UPLOAD_FAILED');
    }
    const key = keys[0];
    const count = await this.prisma.hallImage.count({ where: { hallId } });
    await this.prisma.hallImage.create({
      data: {
        hallId,
        key,
        url: null,
        position: count,
        isCover: count === 0,
      },
    });
    const signedUrl = await this.r2Service.getSignedUrl(key);
    return { message: 'IMAGE_UPLOADED', key, url: signedUrl };
  }
}
