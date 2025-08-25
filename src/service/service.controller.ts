import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/create.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) {}

    @Get()
    async  getAllServices() {
        await this.serviceService.getAllServices();
        return {
            message: 'All services retrieved successfully',
            services: await this.serviceService.getAllServices()
        }
    }

    @Get('nearest')
        // @Roles('client') 
        // @UseGuards(JwtAuthGuard, RolesGuard)
        @ApiOperation({ summary: 'Get nearest services' })
        @ApiQuery({ name: 'latitude', required: true, type: Number })
        @ApiQuery({ name: 'longitude', required: true, type: Number })
        @ApiQuery({ name: 'distance', required: true, type: Number })
        async nearestS(@Query('latitude') latitude: number, @Query('longitude') longitude: number, @Query('distance') distance: number, @Query('service') service :string) {
            if (!latitude || !longitude || !distance) {
                return {
                    message: 'Latitude, Longitude and Distance are required'
                }
            }
            const nearestSalons = await this.serviceService.nearestService({ latitude, longitude, distance , service});
            return {
                message: 'Nearest salons retrieved successfully',
                nearestSalons,
            };
        }

    @Get(':id')
    async getServiceById(@Param('id') id: number) {
        if (!id) {
            return {
                message: 'Service ID is required'
            }
        }
      await this.serviceService.getServiceById(id);
      return {
        message: 'Service retrieved successfully',
        services: await this.serviceService.getServiceById(id)
    }
    }
    @Post()
   async createService(@Body() body: CreateServiceDto) {
        if (!body) {
            return {
                message: 'Service data is required'
            }
        }
        await this.serviceService.createService(body);
        return {
            message: 'Service created successfully',
            service: body
        }
    }
    @Patch(':id')
    async updateService(@Param('id') id: number, @Body() body: UpdateServiceDto) {
        if (!id) {
            return {
                message: 'Service ID is required'
            }
        }
        if (!body) {
            return {
                message: 'Service data is required'
            }
        }
        await this.serviceService.updateService(id, body);
        return {
            message: 'Service updated successfully',
            service: body
        }
    }
    @Delete(':id')
    async deleteService(@Param('id') id: number) {
        if (!id) {
            return {
                message: 'Service ID is required'
            }   
        }
        await this.serviceService.deleteService(id);
        return {
            message: 'Service deleted successfully',
            serviceId: id
        }
    }
   }
