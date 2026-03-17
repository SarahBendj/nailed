import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Availability } from 'src/models/availibility.model';
import { AvailabilityDto, AvailabilityGroupDto } from './dto/availability.dto';
import { Hall } from 'src/models/hall.model';
import { checkDays } from './utils/availability.checkDays';

@Injectable()
export class AvailabilityService {
async getAllAvailabilities() {
  const availabilities = await Availability.findAll();

  if (!availabilities || availabilities.length === 0) {
    return [];
  }

  const halls = await Hall.findAll();
  const result = halls.map((hall : any) => {
    const hallAvailabilities = availabilities.filter(
      (availability : any) => availability.hall_id === hall.id
    );

    return {
      hall_id: hall.id,
      hall_name: hall.name,
      availabilities: hallAvailabilities,
    };
  });

  return result;
}


// async getAvailability(id : number) {
//   if(!id ){
//      throw new BadRequestException('missing_id')
//   }
//   const availability = await Availability.findByhallId(id)
//   if(!availability){
//     throw new BadRequestException('not_found')
//   }

//   return availability

// }

  async getAvailabilityByGuessingName(hallName: string) {
  const availabilityList = await Availability.findByName(hallName);

  if (!availabilityList || availabilityList.length === 0) {
    return {
      message: 'No availability found for the given hall name.',
      results: [],
    };
  }

  // Step 1: Group availabilities by hall_id
  const grouped = new Map<number, any[]>() ;

 for (const a of availabilityList) {
  if (!grouped.has(a.hall_id)) {
    grouped.set(a.hall_id, []);
  }

  const arr = grouped.get(a.hall_id);
  arr?.push(a); 
}

  const hallIds = Array.from(grouped.keys());
  const hallFetches = await Promise.all(hallIds.map(id => Hall.findOne(id)));


  const availability = hallFetches.map(hall => ({
    hall,
    availabilities: grouped.get(hall.id) || [],
  }));

  return {
    message: 'Availabilities grouped by hall',
    availability,
  };
}

// async createAvailability(group: AvailabilityGroupDto) {

//   const { hall_id, sequence, availability } = group;
//     console.log('Received group data:', group); 
 

//   if (!hall_id || !sequence || !Array.isArray(availability) || availability.length === 0) {
//     throw new NotFoundException('hall_id, sequence, and availability array are required.');
//   }


//   //*REJECT REINSERTION
//     const existingAvailability = await Availability.findByhallId(hall_id);
//     console.log('Existing availability for hall_id', hall_id, ':', existingAvailability);
//     if (existingAvailability ) {
//       throw new BadRequestException('Weekly availability already exists for this hall and sequence. delete it first.');
//     }

//     await checkDays(availability);
    

//   const entries = availability.map((item) => ({
//     //*FIRST CHECK THE DAYS
//     hall_id,
//     sequence,
//     day: item.day?.toLowerCase(),
//     is_open: item.is_open,
//     note: item.note || '',
//     start_time: item.start_time,
//     end_time: item.end_time,
//   }));

//   const created = await Promise.all(
//     entries.map((entry) => Availability.Create(entry))
//   );

//   return {
//     message: 'Weekly availability created successfully for sequence: ' + sequence,
//     availability: created,
//   };

// }

async updateAvailability(id : number ,data: Partial<AvailabilityDto>) {

  if (!id || !data.day) {
    throw new NotFoundException('hall_ID OR DAY is required for update.');
  }
  const existingAvailability = await Availability.findDayAvailability(id, data.day);
  console.log('Existing ',  existingAvailability);
  if (!existingAvailability) {
    throw new NotFoundException('No availability found for the given ID.');

  }
  console.log('Existing availability for hall_id', id, 'and day', data.day, ':', existingAvailability);
  const updatedAvailability = await Availability.updateDayAvailability(id, existingAvailability.id , data);
  return updatedAvailability;


}
}
