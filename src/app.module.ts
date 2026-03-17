import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
// import { ServiceController } from './service/service.controller';
// import { ServiceModule } from './service/service.module';
// import { AvailabilityController } from './availability/availability.controller';
// import { AvailabilityService } from './availability/availability.service';
// import { AvailabilityModule } from './availability/availability.module';
import { HallService } from './hall/hall.service';
import { HallModule } from './hall/hall.module';
import { HallController } from './hall/hall.controller';
// import { ImagesController } from './images/images.controller';
// import { ImagesService } from './images/images.service';
// import { ImagesModule } from './images/images.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guards';
import { JwtAuthGuard } from './common/guards/jwt.guards';
// import { JwtAuthGuard } from './common/guards/jwt.guards';
// import { BookingController } from './booking/booking.controller';
// import { BookingModule } from './booking/booking.module';
// import { ScheduleModule } from '@nestjs/schedule';
// import { ReviewController } from './review/review.controller';
// import { ReviewService } from './review/review.service';
// import { ReviewModule } from './review/review.module';
import { R2Controller } from './r2/r2.controller';
import { R2Service } from './r2/r2.service';
import { R2Module } from './r2/r2.module';
import { HallServicesModule } from './hall-services/hall-services.module';
import {  ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './common/guards/throtller.rate.limite';
import { PrismaModule } from './prisma';





// @Module({
//   imports: [UsersModule, AuthModule, ServiceModule, AvailabilityModule, AvailabilityModule, SalonModule, ImagesModule,BookingModule, ScheduleModule.forRoot(), ReviewModule],
//   controllers: [AppController, AuthController, ServiceController,  SalonController, ImagesController, BookingController, ReviewController],
//   providers: [AppService,  SalonService, ImagesService ,
//      {
//       provide: APP_GUARD,
//       useClass: JwtAuthGuard,   // makes JWT guard global
//     },
//     {
//       provide: APP_GUARD,
//       useClass: RolesGuard,     // runs after JwtAuthGuard
//     },
//     ReviewService,

//   ],
 
// })


@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HallModule,
    R2Module,
    HallServicesModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 5,
        },
      ],
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    HallController,
    R2Controller,
  ],
  providers:[
    AppService,
    HallService,
    R2Service,
    // ⚡ Guards globaux dans le bon ordre
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard, 
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],

  
})


export class AppModule {}
