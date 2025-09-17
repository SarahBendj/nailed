import { Body, Controller, Get, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { createReservationDTO, updateReservationDTO } from './dto/booking.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    salon_id: number;
    role: string;
    user_id: number;
 
  };
}

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService : BookingService ) {}

    @Get('salon')
    async displayBookingsBysalonId(@Req() request: AuthenticatedRequest) {
        const id = request.user?.role === 'salon' ? request.user.salon_id : null;
            if (!id) {
            throw new UnauthorizedException('You are not authorized to access this resource');
            }
        const result = await this.bookingService.getBookingsBysalonId(Number(id))
        return result
    }
   @Get('client')
    async displayBookingsByClientId(@Req() request: AuthenticatedRequest) {
    // Vérifie que l'utilisateur est bien un client
    const id = request.user?.role === 'client' ? request.user?.user_id : null;

    if (!id) {
        throw new UnauthorizedException('You are not authorized to access this resource');
    }
    const result = await this.bookingService.getBookingsByClientId(Number(id));

    return result;
    }


    @Post()
    async createAreservation(@Body() data : createReservationDTO){
        const result = await this.bookingService.createReservation(data)
        return result

    }

    @Patch('client/:id')
    async updateAreservationByClient(@Body() Body :Partial<updateReservationDTO> , @Req() request: AuthenticatedRequest){
        const id = request.user?.role === 'salon' ? Number(request.user.user_id) : null;
            if (!id) {
            throw new UnauthorizedException('You are not authorized to access this resource');
            }
        const status = Body.status
        
        const result = await this.bookingService.updateReservationByClient({id ,status})
        return result
    }

     @Patch('salon/manage')
    async updateAreservationBySalon(@Body() Body :Partial<updateReservationDTO> ,@Req() request: AuthenticatedRequest){
        const id = request.user?.role === 'salon' ? Number(request.user.salon_id) : null;
            if (!id) {
            throw new UnauthorizedException('You are not authorized to access this resource');
            }
        const status = Body.status
        const result = await this.bookingService.updateReservationBySalon({id ,status  })
        return result
    }

    @Post('salon/check-in')
    async checkInClient(@Body() body :any,  @Req() request: AuthenticatedRequest){
         const salon_id = request.user?.role === 'salon' ? request.user.salon_id : null;
            if (!salon_id) {
            throw new UnauthorizedException('You are not authorized to access this resource');
    }
         const data = body.data
         const result = await this.bookingService.checkingBookingValidity(data , Number(salon_id) )
         return result
    }

}
