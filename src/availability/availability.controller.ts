import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto, AvailabilityGroupDto } from './dto/availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService){}

    @Get()
    async getAllAvailabilities() {
        const availabilities = await this.availabilityService.getAllAvailabilities();

        return {
            message: 'All availabilities retrieved successfully',
            availabilities,
            
        };
    }

    
  @Get('search')
  async getAvailabilityByGuessingName(@Query('salonName') salonName: string) {
    const response = await this.availabilityService.getAvailabilityByGuessingName(salonName);



    return {
      message: 'Availability retrieved successfully',
      matchedSalons : response.availability,
   
    };
  }

  @Post()
    async createAvailability(@Body() data : AvailabilityGroupDto) {
        const availability = await this.availabilityService.createAvailability(data);
    
        return {
        message: 'Availability created successfully',
        availability,
        };
    }
}