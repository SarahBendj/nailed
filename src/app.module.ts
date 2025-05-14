import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ServiceController } from './service/service.controller';
import { ServiceModule } from './service/service.module';
import { AvailibilityService } from './availibility/availibility.service';
import { AvailibilityController } from './availibility/availibility.controller';
import { AvailibilityModule } from './availibility/availibility.module';

@Module({
  imports: [UsersModule, AuthModule, ServiceModule, AvailibilityModule],
  controllers: [AppController, AuthController, ServiceController, AvailibilityController],
  providers: [AppService, AvailibilityService],
})
export class AppModule {}
