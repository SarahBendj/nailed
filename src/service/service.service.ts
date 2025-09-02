import { BadRequestException, Injectable } from '@nestjs/common';
import { Service  } from 'src/models/service.model';
import { CreateServiceDto, serviceGpsDto, UpdateServiceDto } from './dto/create.service';
import { findNearbySalons } from 'utility/GPS';

@Injectable()
export class ServiceService {
    
    async getAllServices() {
        const services = await Service.findAll();
        if (!services)  return  []
        else  return services;
    }

    async getServiceById(id: number) {
        if (!id) {
            throw new Error('Service ID is required');
        }
        const service = await Service.findOne(id)
        console.log(service);
        if (!service) {
            throw new Error('Service not found');
        }
        return service;
    }
//       return null;
    async createService(service: CreateServiceDto) {
        if (!service) {
            throw new BadRequestException('Service data is required');
        }
        const newService = await Service.Create(service);
        if (!newService) {
            throw new BadRequestException('Failed to create service');
        }
        return newService;
    }

    async nearestService(data : serviceGpsDto) {
           
        const serviceName = data.service?.toLowerCase();
        const services = await Service.findByName(serviceName);
       

        if (!services || services.length === 0) {
            return [];
        }

        if (!data.latitude || !data.longitude || !data.distance) {
            return services;
        }

        return findNearbySalons(
            data.latitude,
            data.longitude,
            Number(data.distance),
            services
        );
    }

    
        

    async updateService(id: number, service: UpdateServiceDto) {
        if (!id) {
            throw new Error('Service ID is required');
        }
        if (!service) {
            throw new Error('Service data is required');
        }
        const existingService = await Service.findOne(id);
        if (!existingService) {
            throw new BadRequestException('Service not found');
        }
        const updatedService = await Service.Update(id, service);
        if(!updatedService) {
            throw new BadRequestException('Failed to update service');
        }
        return updatedService;
    }
    async deleteService(id: number) {
        if (!id) {
            throw new Error('Service ID is required');
        }
        const existingService = await Service.findOne(id);
        if (!existingService) {
            throw new BadRequestException('Service not found');
        }
        // Check if the service is already deleted
        const deletedService = await Service.Delete(id);
        if(!deletedService) {
            throw new BadRequestException('Failed to delete service');
        } 
        return deletedService;
    }
}
