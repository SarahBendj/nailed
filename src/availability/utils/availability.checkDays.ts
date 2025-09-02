import { BadRequestException } from "@nestjs/common";

export async function checkDays(days: { day: string }[]): Promise<void | boolean> {
  const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    if(days.length !== 7 ){
      throw new BadRequestException('days must contain exactly 7 entries, one for each day of the week.');
    }

    const normalizedDays = days.map(item => item.day?.toLowerCase());
  
    if( normalizedDays.filter((day, index) => normalizedDays.indexOf(day) !== index).length > 0 ){
      throw new BadRequestException('days must not contain duplicate entries. ${');
    }
    

    for ( const day of normalizedDays) {
      if (!DAYS.includes(day)) {
        throw new BadRequestException(`Invalid day: ${day}. Must be one of ${DAYS.join(', ')}.`);
      }
    }
  return  true
}