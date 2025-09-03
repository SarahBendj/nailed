import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingSchedulerService } from './booking.scheduler';

@Module({
  controllers : [BookingController],
  providers : [BookingService , BookingSchedulerService],
  exports : [BookingService]
})
export class BookingModule {}
