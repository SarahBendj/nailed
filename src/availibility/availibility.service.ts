import { Injectable, NotFoundException } from '@nestjs/common';
import { Availibility } from 'src/models/availibility.model';

@Injectable()
export class AvailibilityService {

    async getAllAvailibilities() {
        const availibilities = await Availibility.findAll();
        if (!availibilities) {
            return [];
        }
        return availibilities;
    }

    async getAvailibilityById(id: number) {
        const availibility = await Availibility.findOne(id);
        if (!availibility) {
            throw new NotFoundException(`Availibility with ID ${id} not found`);
        }
        return availibility;
    
    }

    async createAvailibility(availibility: CreateAvailibilityDto) {
        //todo TOKEN const salonAlreadySchedualed = await Availibility.findOne({ where: { salon_id: availibility.salon_id } });
        const newAvailibility = await Availibility.Create(availibility);
        if (!newAvailibility) {
            throw new NotFoundException(`Failed to create availibility`);
        }
        return newAvailibility;
        
    }

    async updateAvailibility(id: number, availibility: UpdateAvailibilityDto) {
        const existingAvailibility = await Availibility.findOne(id);
        if (!existingAvailibility) {
            throw new NotFoundException(`Availibility with ID ${id} not found`);
        }
        return null;
    }

    async deleteAvailibility(id: number) {  
        const existingAvailibility = await Availibility.findOne(id);
        if (!existingAvailibility) {
            throw new NotFoundException(`Availibility with ID ${id} not found`);
        }
        const deletedAvailibility = await Availibility.Delete(id);
        if (!deletedAvailibility) {
            throw new NotFoundException(`Failed to delete availibility with ID ${id}`);
        }
        return null;
    
    }
}
