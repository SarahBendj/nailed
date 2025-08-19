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

@Module({
  imports: [UsersModule, AuthModule, ServiceModule, AvailabilityModule, AvailabilityModule, SalonModule, ImagesModule],
  controllers: [AppController, AuthController, ServiceController, AvailabilityController, AvailabilityController, SalonController, ImagesController],
  providers: [AppService, AvailabilityService, AvailabilityService, SalonService, ImagesService],
})
export class AppModule {}
