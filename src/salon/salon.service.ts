import { Injectable } from '@nestjs/common';
import { Salon } from 'src/models/salon.model';
import { findNearbySalons, GPS } from 'utility/GPS';
import { salonGpsDto } from './dto/salon.dto';

@Injectable()
export class SalonService {

    async getAllSalons() {
        const salons = await Salon.findAll();
        if (!salons || salons.length === 0) {
        return [];
        }
        return salons
    }

    async getSalonById(id: number) {
        const salon = await Salon.findOne(id);
        if (!salon) {
            return {
                message: 'No salon found for the given id.',
                results: [],
            };
        }
        return salon;
    }

    async nearestSalons(data : salonGpsDto) {
        console.log('data', data)
        const salons = await Salon.findAll();
        if (!salons || salons.length === 0) {
            return [];
        };

       const nearestSalons = findNearbySalons(data.latitude, data.longitude, data.distance, salons);
        console.log('nearestSalons', nearestSalons);
        return nearestSalons;

    }


    async desactivateSalon(id: number) {
        const salon = await Salon.findOne(id);  
        if (!salon) {
            return {
                message: 'No salon found for the given id.',
                results: [],
            };
        }
        const desactivatedSalon = await Salon.desactivate(id);
        if (!desactivatedSalon) {
            return {
                message: 'Error desactivating the salon.',
                results: [],
            };
        }
        return desactivatedSalon;
    }

    async deleteSalon(id: number , password: string) { 
        const salon = await Salon.findOne(id);
        if (!salon) {
            return {
                message: 'No salon found for the given id.',
                results: [],
            };
        }
        // const matchedPassword = await bcrypt.compare(password, salon.password);
        // if (!matchedPassword) {
        //     return {
        //         message: 'Password does not match.',
        //         results: [],
        //     };
        // }
        const deletedSalon = await Salon.Delete(id);
        if (!deletedSalon) {
            return {
                message: 'Error deleting the salon.',
                results: [],
            };
        }
        return deletedSalon;    
    }

}
