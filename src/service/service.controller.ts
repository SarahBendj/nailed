import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/create.service';

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
