import { IsNotEmpty, IsString } from "class-validator";

export interface AvailabilityGroupDto {
  salon_id: number;
  sequence: '1 month' | '3 months' | '6 months' | 'always';
  availability: Omit<AvailabilityDto, 'salon_id' | 'date'>[]; 
}


export class AvailabilityDto {
  @IsNotEmpty()
  @IsString()
  salon_id: string;

  @IsNotEmpty()
  @IsString()
  sequence: string;

  @IsNotEmpty()
  @IsString()
  day: string;

  @IsNotEmpty()
  @IsString()
  is_open: string;

  @IsNotEmpty()
  @IsString()
  note : string;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsNotEmpty()
  @IsString()
  end_time: string;
  

}
