import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ServiceService } from './service.service';

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
   async createService(@Body() body: any) {
        if (!body) {
            return {
                message: 'Service data is required'
            }
        }
        return {
            message: 'Service created successfully',
            service: body
        }
    }
   }
