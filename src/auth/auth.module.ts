import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { NewUserMailing } from 'utility/mailing/newUser.client';
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
  providers: [AuthService , NewUserMailing],
  exports: [AuthService ,JwtModule],
})
export class AuthModule {}
