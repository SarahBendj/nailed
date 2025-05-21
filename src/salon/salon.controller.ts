import { Controller, Get, Param, Query } from '@nestjs/common';
import { SalonService } from './salon.service';

@Controller('salon')
export class SalonController {
    constructor(private readonly salonService: SalonService){}

    @Get()
    async getAllSalons() {
        const salons = await this.salonService.getAllSalons();
        return {
            message: 'All salons retrieved successfully',
            salons,
        };
    }
  
    @Get('nearest')
    async nearestSalons(@Query('latitude') latitude: number, @Query('longitude') longitude: number, @Query('distance') distance: number) {
        if (!latitude || !longitude || !distance) {
            return {
                message: 'Latitude, Longitude and Distance are required'
            }
        }
        const nearestSalons = await this.salonService.nearestSalons({ latitude, longitude, distance });
        return {
            message: 'Nearest salons retrieved successfully',
            nearestSalons,
        };
    }

      @Get(':id')
    async getSalonById(@Param('id') id: number) {
        if (!id) {
            return {
                message: 'Salon ID is required'
            }
        }
        const salon = await this.salonService.getSalonById(id);
        return {
            message: 'Salon retrieved successfully',
            salon,
        };
    }
}
