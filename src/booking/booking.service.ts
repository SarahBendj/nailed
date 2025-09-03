import { BadRequestException, Injectable } from '@nestjs/common';
import { createReservationDTO, updateReservationDTO } from './dto/booking.dto';
import { Booking } from 'src/models/booking.model';

@Injectable()
export class BookingService {
  async createReservation(data: createReservationDTO) {
    if (!data) {
      throw new BadRequestException('MISSING_DATA');
    }
    //*CHECK IF THAT SLOT HAS ALREADY BEEN RESERVED/CONFIRMED/REQUESTED
    const { salon_id, start_time , end_time , date } = data
    const existingSlot = await Booking.findExistingSlot( Number(salon_id) ,date, start_time , end_time )
    if(existingSlot) {
        console.log(existingSlot)
        throw new BadRequestException('SLOT_RESERVED')
    }

    const reserved = await Booking.Create({
      ...data,
      status: 'reserved',
    });

    return reserved;
  }

  async updateReservation(data: updateReservationDTO) {
       const { id ,status } = data;

    if(!status || !id) {
        throw new BadRequestException('MISSING_DATA');

    }

    const findReservation = await Booking.findOne(Number(id))
    if(!findReservation) {
        throw new BadRequestException('NOT_FOUND')
    }

     //*CANCELLED CASE :if reservation is cancelled no going back
    const isCancelled = await Booking.checkIfCancelled(Number(id))
    if(isCancelled) {
        throw new BadRequestException('RESERVATION_CANCELLED')
    }

    //*CANCELLING : client OR salon is cancelling

    const CANCEL_STATUSES = ['cancelled_by_client', 'cancelled_by_salon'];
    if (CANCEL_STATUSES.includes(status)) {
        await Booking.releaseCancelledReservations(Number(id))
    }

    //*PROCESSING FLOW: REQUESTED OR CONFIRMED
  const ALLOWED_STATUSES = ['requested', 'confirmed'];
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new BadRequestException('INVALID_STATUS');
  }

    const affectedReservation = await Booking.Update(Number(id) ,
      { status: status },
    )


    return affectedReservation
  }
  async freeNonUsedreservationOlderThanfifteenMins(){

    const freeReservations = await Booking.releaseOldReservations()
    if(!freeReservations){
        return []
    }else 
        return freeReservations

  }
}

