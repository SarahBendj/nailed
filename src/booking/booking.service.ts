import { BadRequestException, Injectable } from '@nestjs/common';
import { createReservationDTO, updateReservationDTO } from './dto/booking.dto';
import { Booking } from 'src/models/booking.model';
import { Booking_Event } from 'src/models/booking.events.model';
import { generateOTP } from 'utility/algo/generate_otp';
import { Codes } from 'src/models/codes.model';

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

async getBookingsByClientId(id: number): Promise<any[]> {
  if (!id) {
    throw new BadRequestException('MISSING_ID');
  }

  const bookings = await Booking.findByClientId(Number(id));

  if (!bookings || bookings.length === 0) {
    return []; 
  }

  const result = bookings.map(booking => {
    const payload = {
      booking_id: booking.id,
      client_id: booking.client_id,
      code: booking.code,        
      booking_date: booking.date,
      booking_time: booking.start_time
    };

    const qr_code_string = Buffer.from(JSON.stringify(payload)).toString('base64');

    return {
      booking,          
      qr_code_string      
    };
  });

  return result;
}


  async updateReservationByClient(data: updateReservationDTO) {
  const { id, status: newStatus } = data;

  if (!newStatus || !id) {
    throw new BadRequestException('MISSING_DATA');
  }

  const reservationFound = await Booking.findOne(Number(id));
  if (!reservationFound) {
    throw new BadRequestException('NOT_FOUND');
  }

  //REPORT HISTORY INTO BOOKING EVENT TABLE
    const { id: _ignore, checked_in,  ...rest } = reservationFound;

    await Booking_Event.Create({
      ...rest,                   
      booking_id: id,             
    });

  //ALREADY CANCELLED => BLOCK TRANSACTION
  const isCancelled = await Booking.checkIfCancelled(Number(id));
  if (isCancelled) {
    throw new BadRequestException('RESERVATION_CANCELLED');
  }

  const CANCEL_STATUSES = ['cancelled_by_client'];
  const ALLOWED_STATUSES = ['requested'];

  let affectedReservation;

  if (CANCEL_STATUSES.includes(newStatus)) {
    //CANCELLING CASE : RESET SLOTS
    affectedReservation = await Booking.cancelReservations(Number(id) ,newStatus);
  } else {
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      throw new BadRequestException('INVALID_STATUS : ONLY -- requested OR cancelled_by_client --ARE ALLOWED');
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
      const { id: _ignore, checked_in, ...rest } = reservation;

      await Booking_Event.Create({
        ...rest,
        booking_id: reservation.id,
      });
    }
  }

  await Booking.releaseCancelledReservations();

  return freeReservations || [];
}

async updateReservationBySalon(data: updateReservationDTO) {
  const { id, status: newStatus } = data;

  if (!newStatus || !id) throw new BadRequestException('MISSING_DATA');

  const reservationFound = await Booking.findOne(Number(id));
  if (!reservationFound) throw new BadRequestException('NOT_FOUND');

  // Report history
  const { id: _ignore, checked_in: __ignore, ...rest } = reservationFound;
  await Booking_Event.Create({ ...rest, booking_id: id });

  // Already cancelled?
  const isCancelled = await Booking.checkIfCancelled(Number(id));
  if (isCancelled) throw new BadRequestException('RESERVATION_CANCELLED');

  const CANCEL_STATUSES = ['cancelled_by_salon'];
  const ALLOWED_STATUSES = ['confirmed'];

  let affectedReservation;

  if (CANCEL_STATUSES.includes(newStatus)) {
    // Cancelling case
    affectedReservation = await Booking.cancelReservations(Number(id), newStatus);
  } else if (ALLOWED_STATUSES.includes(newStatus)) {
    // Confirmed case
    affectedReservation = await Booking.Update(Number(id), { status: newStatus });

    // Generate OTP
 
    await Codes.Create({
      code: generateOTP(6),
      booking_id: Number(id),
      client_id: reservationFound.client_id,
      salon_id: reservationFound.salon_id,
      booking_date: reservationFound.date,
      booking_time: reservationFound.start_time
    });

    //todo SEND NOTIFICATION TO CLIENT WITH OTP
  } else {
    throw new BadRequestException('INVALID_STATUS');
  }

  return affectedReservation;
}

async checkingBookingValidity(data: string , salon_id : number) {
  if (!data || !salon_id) throw new BadRequestException('MISSING_DATA');

  // Décryptage base64
  let bookingInfo;
  try {;
    const decoded = Buffer.from(data, 'base64').toString('utf8');
     bookingInfo = JSON.parse(decoded);
     console.log(bookingInfo)

  } catch (err) {
    throw new BadRequestException('INVALID_DATA');
  }

  const { booking_id, code, client_id, booking_date, booking_time } = bookingInfo;
  console.log(booking_date)
  if (!booking_id || !code || !client_id ) throw new BadRequestException('MISSING_DATA');

  // Vérifie la validité de la date du rendez-vous
  const now = new Date();
  const bookingDateTime = new Date(`${booking_date}T${booking_time}`);
  const diffMs = now.getTime() - bookingDateTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours > 1) {
    throw new BadRequestException('YOUR_BOOKING_IS_EXPIRED');
  }
  // Vérifie si le code existe
  const codeEntry = await Codes.findByInfo(
    { booking_id, code, client_id , salon_id ,booking_time})

  // Supprime la ligne pour usage unique
  // await Codes.Delete(codeEntry.id);

  // Mets à jour le check-in de la réservation
   await Booking.Update(booking_id, { checked_in: true });

  return { success: true, message: 'Booking validated successfully' };
}


async deleteFreeReservations(){
  await Booking.DeleteFree()
}

}

