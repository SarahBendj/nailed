import { Injectable } from '@nestjs/common';
import { Service } from 'src/models/service.model';

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
    async createService(service: any) {
        if (!service) {
            throw new Error('Service data is required');
        }
        const newService = await Service.Create(service);
        return newService;
    }
    async updateService(id: number, service: any) {
        if (!id) {
            throw new Error('Service ID is required');
        }
        if (!service) {
            throw new Error('Service data is required');
        }
        const updatedService = await Service.Update(id, service);
        return updatedService;
    }
    async deleteService(id: number) {
        if (!id) {
            throw new Error('Service ID is required');
        }
        const deletedService = await Service.Delete(id);
        return deletedService;
    }
}
