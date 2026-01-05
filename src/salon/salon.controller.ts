import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { SalonService } from './salon.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { JwtAuthGuard } from 'src/common/guards/jwt.guards';
import { Public } from 'src/common/decorators/public.decorators';

@ApiTags('salons')
@Controller('salon')
export class SalonController {
    constructor(private readonly salonService: SalonService){}

    @Get()
    @ApiOperation({ summary: 'Get all salons' })

    async getAllSalons() {
        const salons = await this.salonService.getAllSalons();
        return {
            message: 'All salons retrieved successfully',
            salons,
        };
    }
  
    @Get('nearest')
    @Roles('client') 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Get nearest salons' })
    @ApiQuery({ name: 'latitude', required: true, type: Number })
    @ApiQuery({ name: 'longitude', required: true, type: Number })
    @ApiQuery({ name: 'distance', required: true, type: Number })
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

    @Get('best-rated')
    async displayBestRated(){
        const result = await this.salonService.getBestRated()
        return result

    }

      @Get(':id')
      @ApiOperation({ summary: 'Get salon by ID' })
      @ApiQuery({ name: 'id', required: true, type: Number })
    async getSalonById(@Param('id') id: number) {
        if (!id) {
            return {
                message: 'MISSING_ID'
            }
        }
        const salon = await this.salonService.getSalonById(id);
        return {
            message: 'Salon retrieved successfully',
            salon,
        };

    }
    @Patch('desactivate/:id')
    async desactivateSalon(@Param('id') id: number) {
        if (!id) {
            return {
                message: 'Salon ID is required' 
            }
        }
        const salon = await this.salonService.desactivateSalon(id);
        return {
            message: 'Salon desactivated successfully',
            salon,
        };
    }

    @Delete(':id')
    async deleteSalon(@Param('id') id: number , @Body() password: string) {
        if (!password) { 
            return {
                message: 'Password is required'
            }
        }
        if (!id) {
            return {
                message: 'Salon ID is required'
            }
        }
        const salon = await this.salonService.deleteSalon(id, password)  
          return {
            message: 'Salon deleted successfully',
            salon,
        };
    }
    
}
