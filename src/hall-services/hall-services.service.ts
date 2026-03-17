import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class HallServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllHallServices() {
    const services = await this.prisma.hallServiceType.findMany();
    if (!services || services.length === 0) {
      return [];
    }
    return services;
  }
}
