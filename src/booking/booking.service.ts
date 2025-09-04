import { BadRequestException, Injectable } from '@nestjs/common';
import { createReservationDTO, updateReservationDTO } from './dto/booking.dto';
import { Booking } from 'src/models/booking.model';
import { Booking_Event } from 'src/models/booking.events.model';

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

  async getBookingsBysalonId(id : number) :Promise<any[]>{

    if(!id) {
      throw new BadRequestException('MISSING_ID')
    }

    const bookings = await Booking.findBySalonId(Number(id))
    if (bookings && bookings.length > 0){
      return bookings
    }else return []
  }

  async updateReservation(data: updateReservationDTO) {
  const { id, status: newStatus } = data;

  if (!newStatus || !id) {
    throw new BadRequestException('MISSING_DATA');
  }

  const reservationFound = await Booking.findOne(Number(id));
  if (!reservationFound) {
    throw new BadRequestException('NOT_FOUND');
  }

  //REPORT HISTORY INTO BOOKING EVENT TABLE
    const { id: _ignore, ...rest } = reservationFound;

    await Booking_Event.Create({
      ...rest,                   
      booking_id: id,             
    });

  //ALREADY CANCELLED => BLOCK TRANSACTION
  const isCancelled = await Booking.checkIfCancelled(Number(id));
  if (isCancelled) {
    throw new BadRequestException('RESERVATION_CANCELLED');
  }

  const CANCEL_STATUSES = ['cancelled_by_client', 'cancelled_by_salon'];
  const ALLOWED_STATUSES = ['requested', 'confirmed'];

  let affectedReservation;

  if (CANCEL_STATUSES.includes(newStatus)) {
    //CANCELLING CASE : RESET SLOTS
    affectedReservation = await Booking.cancelReservations(Number(id) ,newStatus);
  } else {
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      throw new BadRequestException('INVALID_STATUS');
    }
   

    //UPDATE STATUS INTO PRINCIPAL BOOKING TABLE
    affectedReservation = await Booking.Update(Number(id), { status: newStatus });
  }

  return affectedReservation;

}

async freeNonUsedreservationOlderThanFifteenMins() {
  const freeReservations = await Booking.releaseOldReservations();
  const cancelledReservations = await Booking.findCancelled();

  if (cancelledReservations.length > 0) {
    for (const reservation of cancelledReservations) {
      const { id: _ignore, ...rest } = reservation;

      await Booking_Event.Create({
        ...rest,
        booking_id: reservation.id,
      });
    }
  }

  await Booking.releaseCancelledReservations();

  return freeReservations || [];
}

async deleteFreeReservations(){
  await Booking.DeleteFree()
}

}

