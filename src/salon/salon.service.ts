import { Injectable } from '@nestjs/common';
import { Salon } from 'src/models/salon.model';
import { findNearbySalons, GPS } from 'utility/GPS';
import { salonGpsDto } from './dto/salon.dto';
import { ImagesService }  from  'src/images/images.service';

@Injectable()
export class SalonService {
    constructor(private readonly imagesService: ImagesService) {} 
    
  async getAllSalons() {
    const salons = await Salon.findAll();
    console.log('salons', salons);

    if (!salons || salons.length === 0) {
      return [];
    }

    // On récupère les images pour chaque salon
    const salonsWithImages = await Promise.all(
      salons.map(async (salon) => {
        const images = await this.imagesService.retriveImages('salons', salon.id.toString());
        return {
          ...salon,
          images: images.urls, // toujours un tableau, vide si aucune image
        };
      }),
    );

    return salonsWithImages;
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
        const salons = await Salon.findAll();
        if (!salons || salons.length === 0) {
            return [];
        };

       const nearestSalons = findNearbySalons(data.latitude, data.longitude, data.distance, salons);
        console.log('nearestSalons', nearestSalons);
        return nearestSalons;

    }
    
    async getBestRated() {
        const salons = await Salon.findBestRated();
        if (!salons || salons.length === 0) {
            return [];
        };

       
        return salons;

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
