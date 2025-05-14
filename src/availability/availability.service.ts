import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Availability } from 'src/models/availibility.model';
import { AvailabilityDto, AvailabilityGroupDto } from './dto/availability.dto';
import { Salon } from 'src/models/salon.model';

@Injectable()
export class AvailabilityService {
async getAllAvailabilities() {
  const availabilities = await Availability.findAll();

  if (!availabilities || availabilities.length === 0) {
    return [];
  }

  const salons = await Salon.findAll();
  const result = salons.map((salon : any) => {
    const salonAvailabilities = availabilities.filter(
      (availability : any) => availability.salon_id === salon.id
    );

    return {
      salon_id: salon.id,
      salon_name: salon.name,
      availabilities: salonAvailabilities,
    };
  });

  return result;
}


   async getAvailabilityByGuessingName(salonName: string) {
  // If no salon name is provided, return all availabilities
//   const allSalons = await Availability.findAll();

//   if (!salonName) {
//     return {
//       message: 'All availabilities retrieved successfully',
//       availabilities: allSalons,
//     };
  

  const availability = await Availability.findByName( salonName); 

  if (!availability) {
    return {
      message: 'No specific availability found. Returning all.',
      availabilities: [],
    };
  }

  return {
    message: 'Availability retrieved successfully',
    availability,
  };
  }

async createAvailability(group: AvailabilityGroupDto) {
  const { salon_id, sequence, availability } = group;
 

  if (!salon_id || !sequence || !Array.isArray(availability) || availability.length === 0) {
    throw new NotFoundException('salon_id, sequence, and availability array are required.');
  }


  //*REJECT REINSERTION
    const existingAvailability = await Availability.findBySalonId(salon_id);
    if (existingAvailability ) {
      throw new BadRequestException('Weekly availability already exists for this salon and sequence. delete it first.');
    }

  const entries = availability.map((item) => ({
    salon_id,
    sequence,
    day: item.day?.toLowerCase(),
    is_open: item.is_open,
    note: item.note || '',
    start_time: item.start_time,
    end_time: item.end_time,
  }));

  const created = await Promise.all(
    entries.map((entry) => Availability.Create(entry))
  );

  return {
    message: 'Weekly availability created successfully for sequence: ' + sequence,
    availability: created,
  };
}





}
