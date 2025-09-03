import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { createReservationDTO, updateReservationDTO } from './dto/booking.dto';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService : BookingService ) {}

    // @Get


    @Post()
    async createAreservation(@Body() data : createReservationDTO){
        const result = await this.bookingService.createReservation(data)
        return result

    }

    @Patch(':id')
    async updateAreservation(@Body() Body :Partial<updateReservationDTO> , @Param('id') id : string){
        
        console.log('here')
        const status = Body.status
        const result = await this.bookingService.updateReservation({id ,status})
        return result
    }

}
