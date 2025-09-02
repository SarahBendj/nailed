import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
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

  @Get(':id')
    async getAvailability(@Param('id') id : number) {
        const availabilities = await this.availabilityService.getAvailability(id);
        return {
            message: 'All availabilities retrieved successfully',
            availabilities,
            
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

  @Patch(':id')
  async updateAvailability(@Param('id') id:number , @Body()   data: Partial<AvailabilityDto>) {
    console.log('Updating availability with ID:', id, 'and data:', data);
    const availability = await this.availabilityService.updateAvailability(id,data);
    return {
      message: 'Availability updated successfully',
      availability,
    };
  }
}