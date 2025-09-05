import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ServiceController } from './service/service.controller';
import { ServiceModule } from './service/service.module';
import { AvailabilityController } from './availability/availability.controller';
import { AvailabilityService } from './availability/availability.service';
import { AvailabilityModule } from './availability/availability.module';
import { SalonController } from './salon/salon.controller';
import { SalonService } from './salon/salon.service';
import { SalonModule } from './salon/salon.module';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { ImagesModule } from './images/images.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guards';
import { JwtAuthGuard } from './common/guards/jwt.guards';
import { BookingController } from './booking/booking.controller';
import { BookingModule } from './booking/booking.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewController } from './review/review.controller';
import { ReviewService } from './review/review.service';
import { ReviewModule } from './review/review.module';




@Module({
  imports: [UsersModule, AuthModule, ServiceModule, AvailabilityModule, AvailabilityModule, SalonModule, ImagesModule,BookingModule, ScheduleModule.forRoot(), ReviewModule],
  controllers: [AppController, AuthController, ServiceController,  SalonController, ImagesController, BookingController, ReviewController],
  providers: [AppService,  SalonService, ImagesService ,
     {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,   // makes JWT guard global
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,     // runs after JwtAuthGuard
    },
    ReviewService,

  ],
 
})
export class AppModule {}
