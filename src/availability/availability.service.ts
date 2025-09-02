import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Availability } from 'src/models/availibility.model';
import { AvailabilityDto, AvailabilityGroupDto } from './dto/availability.dto';
import { Salon } from 'src/models/salon.model';
import { checkDays } from './utils/availability.checkDays';

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


async getAvailability(id : number) {
  if(!id ){
     throw new BadRequestException('missing_id')
  }
  const availability = await Availability.findBySalonId(id)
  if(!availability){
    throw new BadRequestException('not_found')
  }

  return availability

}

  async getAvailabilityByGuessingName(salonName: string) {
  const availabilityList = await Availability.findByName(salonName);

  if (!availabilityList || availabilityList.length === 0) {
    return {
      message: 'No availability found for the given salon name.',
      results: [],
    };
  }

  // Step 1: Group availabilities by salon_id
  const grouped = new Map<number, any[]>() ;

 for (const a of availabilityList) {
  if (!grouped.has(a.salon_id)) {
    grouped.set(a.salon_id, []);
  }

  const arr = grouped.get(a.salon_id);
  arr?.push(a); 
}

  const salonIds = Array.from(grouped.keys());
  const salonFetches = await Promise.all(salonIds.map(id => Salon.findOne(id)));


  const availability = salonFetches.map(salon => ({
    salon,
    availabilities: grouped.get(salon.id) || [],
  }));

  return {
    message: 'Availabilities grouped by salon',
    availability,
  };
}

async createAvailability(group: AvailabilityGroupDto) {

  const { salon_id, sequence, availability } = group;
    console.log('Received group data:', group); 
 

  if (!salon_id || !sequence || !Array.isArray(availability) || availability.length === 0) {
    throw new NotFoundException('salon_id, sequence, and availability array are required.');
  }


  //*REJECT REINSERTION
    const existingAvailability = await Availability.findBySalonId(salon_id);
    console.log('Existing availability for salon_id', salon_id, ':', existingAvailability);
    if (existingAvailability ) {
      throw new BadRequestException('Weekly availability already exists for this salon and sequence. delete it first.');
    }

    await checkDays(availability);
    

  const entries = availability.map((item) => ({
    //*FIRST CHECK THE DAYS
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

async updateAvailability(id : number ,data: Partial<AvailabilityDto>) {

  if (!id || !data.day) {
    throw new NotFoundException('Salon_ID OR DAY is required for update.');
  }
  const existingAvailability = await Availability.findDayAvailability(id, data.day);
  console.log('Existing ',  existingAvailability);
  if (!existingAvailability) {
    throw new NotFoundException('No availability found for the given ID.');

  }
  console.log('Existing availability for salon_id', id, 'and day', data.day, ':', existingAvailability);
  const updatedAvailability = await Availability.updateDayAvailability(id, existingAvailability.id , data);
  return updatedAvailability;


}
}
