import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ServiceController } from './service/service.controller';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [UsersModule, AuthModule, ServiceModule],
  controllers: [AppController, AuthController, ServiceController],
  providers: [AppService],
})
export class AppModule {}
