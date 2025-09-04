import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingService } from './booking.service';

@Injectable()
export class BookingSchedulerService {
  private readonly logger = new Logger(BookingSchedulerService.name);

  constructor(private readonly bookingService: BookingService) {}

  // Cron executes every minute
@Cron(CronExpression.EVERY_MINUTE)
async releaseOldReservations() {
  try {
    this.logger.debug('################### RELEASING NON USED RESERVATIONS ########################');
    const released = await this.bookingService.freeNonUsedreservationOlderThanFifteenMins();

    if (released && released.length > 0) {
      await this.bookingService.deleteFreeReservations();
      this.logger.log(`Released ${released.length} old reservations`);
    } else {
      this.logger.debug('No old reservations to release');
    }
  } catch (err) {
    this.logger.error('Error releasing old reservations', err);
  }
}

}
