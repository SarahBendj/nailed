import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { JwtAuthGuard } from 'src/common/guards/jwt.guards';
import { HallService } from './hall.service';
import { CreateHallBodyDto } from './dto/hall.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Public } from 'src/common/decorators/public.decorators';

@ApiTags('Halls')
@Controller('hall')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all halls' })
  async getAllSalons() {
    const salons = await this.hallService.getAllHalls();
    return {
      message: 'All salons retrieved successfully',
      salons,
    };
  }

  @Post('owner/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: multer.memoryStorage(),
      limits: { files: 10 },
    }),
  )
  async createHall(
  @Body() body: any,
  @Request() req,
) {
  const userId = req.user.user_id;
  const files = req.files as Express.Multer.File[];
  const data =
    typeof body.data === 'string' ? JSON.parse(body.data) as CreateHallBodyDto: body;
  const hall = await this.hallService.createHall(userId, data, files);

  return {
    hall,
  };
}


  @Get('client/nearest')
  @Public()
  @ApiOperation({ summary: 'Get nearest halls with images' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'distance', required: true, type: Number })
  async nearestSalons(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('distance') distance: string,
  ) {
    if (!latitude || !longitude || !distance) {
      throw new BadRequestException('LATITUDE_LONGITUDE_DISTANCE_REQUIRED');
    }
    function cleanCoordinate(value: string): number {
      if (!value) return NaN;
      const cleaned = value.replace(',', '.').replace(/\.0$/, '');
      return Number(cleaned);
    }
    const latNum = cleanCoordinate(latitude);
    const lngNum = cleanCoordinate(longitude);
    const distNum = cleanCoordinate(distance);
    if (isNaN(latNum) || isNaN(lngNum) || isNaN(distNum)) {
      throw new BadRequestException('LATITUDE_LONGITUDE_DISTANCE_MUST_BE_NUMBERS');
    }
    const nearestHalls = await this.hallService.nearestHalls({
      latitude: latNum,
      longitude: lngNum,
      distance: distNum,
    });

    return {
      message: 'Nearest halls retrieved successfully',
      nearestHalls,
    };
  }

  @Get('owner/my-halls')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async getMyHalls(@Req() req: any) {
    const id = req.user.user_id;
    return this.hallService.getHallById(Number(id));
  }

  @Post('owner/:hallId/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @ApiOperation({ summary: 'Add one image to a hall (owner only)' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async addImage(@Param('hallId') hallId: string, @Req() req: any) {
    const userId = req.user.user_id;
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new BadRequestException('IMAGE_REQUIRED');
    }
    return this.hallService.addImage(userId, Number(hallId), file);
  }

  @Delete('owner/image/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async deleteImage(@Param('imageId') imageId: number, @Req() req: any) {
    const userId = req.user.user_id;
    return this.hallService.deleteImage(userId, imageId);
  }

  @Get('client/best-rated')
  @Public()
  async getBestRated() {
    return this.hallService.getBestRated();
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get hall by ID' })
  // @ApiQuery({ name: 'id', required: true, type: Number })
  // async getSalonById(@Param('id') id: number) {
  //   if (!id) {
  //     return {
  //       message: 'MISSING_ID',
  //     };
  //   }
  //   const hall = await this.hallService.getHallById(id);
  //   return {
  //     message: 'Hall retrieved successfully',
  //     hall,
  //   };
  // }
  @Patch('desactivate/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async desactivateHall(@Param('id') id: number) {
    if (!id) {
      return { message: 'HALL_ID_REQUIRED' };
    }
    const hall = await this.hallService.desactivateSalon(id);
    return { message: 'HALL_DESACTIVATED', hall };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async deleteHall(
    @Param('id') id: number,
    @Body() body: { password?: string },
  ) {
    const password = body?.password;
    if (!password) {
      return { message: 'PASSWORD_REQUIRED' };
    }
    if (!id) {
      return { message: 'HALL_ID_REQUIRED' };
    }
    const hall = await this.hallService.deleteSalon(id, password);
    return { message: 'HALL_DELETED', hall };
  }
}
