import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorators';
import { JwtAuthGuard } from '../common/guards/jwt.guards';
import { RolesGuard } from '../common/guards/roles.guards';
import { HallService } from '../hall/hall.service';

@ApiTags('Client')
@Controller('client/hall')
export class ClientHallController {
  constructor(private readonly hallService: HallService) {}

  @Get()
  @ApiOperation({ summary: 'Get all halls' })
  async getAllHalls() {
    const salons = await this.hallService.getAllHalls();
    return {
      message: 'All salons retrieved successfully',
      salons,
    };
  }

  @Get('nearest')
  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get nearest halls with images' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'distance', required: true, type: Number })
  async nearestHalls(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('distance') distance: string,
  ) {
    if (!latitude || !longitude || !distance) {
      throw new BadRequestException(
        'Latitude, Longitude and Distance are required',
      );
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
      throw new BadRequestException(
        'Latitude, Longitude and Distance must be valid numbers',
      );
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

  @Get('best-rated')
  @ApiOperation({ summary: 'Get best rated halls' })
  async getBestRated() {
    return this.hallService.getBestRated();
  }
}
