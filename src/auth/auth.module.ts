import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import {  UserMailingService } from 'utility/mailing/templates/client/newUser.client';
import { PasswordResetMailing } from 'utility/mailing/templates/owner/resetPassword.mailing';
import { RedisModule } from 'src/database/cache';


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '4h' },
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService , UserMailingService , PasswordResetMailing],
  exports: [AuthService ,JwtModule],
})
export class AuthModule {}
