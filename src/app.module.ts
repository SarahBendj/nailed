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

@Module({
  imports: [UsersModule, AuthModule, ServiceModule, AvailabilityModule, AvailabilityModule],
  controllers: [AppController, AuthController, ServiceController, AvailabilityController, AvailabilityController],
  providers: [AppService, AvailabilityService, AvailabilityService],
})
export class AppModule {}
