import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignOwnerUpDto, updatePasswordDto } from './dto/sign.user.dto';
import { UserMailingService } from 'utility/mailing/templates/client/newUser.client';
import { PasswordResetMailing } from 'utility/mailing/templates/owner/resetPassword.mailing';
import Redis from 'ioredis';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly newUserMailing: UserMailingService,
    private readonly passwordResetMailing: PasswordResetMailing,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async validateUser(phone: string, password: string): Promise<any> {
    if (!phone || !password) {
      throw new BadRequestException('MISSING_CREDENTIALS');
    }

    const user = await this.prisma.user.findFirst({ where: { phone } });
    if (!user) {
      throw new BadRequestException('PHONE_OR_PASSWORD_INVALID');
    }

    const isHashed = user.password.startsWith('$2b$');

    if (!isHashed) {
      if (password === user.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
        return {
          user_id: user.id,
          email: user.email,
          role: user.role,
          salon_id: null,
        };
      } else {
        throw new BadRequestException('PHONE_OR_PASSWORD_INVALID');
      }
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new BadRequestException('EMAIL_OR_PASSWORD_INVALID');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      salon_id: null,
    };
  }

  async login(user: any) {
    const payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
      salon_id: user.salon_id ?? null,
    };

    const userId = user.user_id ?? user.id;
    console.log('user', user);
    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!userData || !userData.emailVerified) {
      throw new BadRequestException('USER_NOT_VERIFIED');
    }

    const oldTokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    if (oldTokens.length > 0) {
      for (const token of oldTokens) {
        await this.prisma.refreshToken.delete({ where: { id: token.id } });
      }
    }

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = randomBytes(64).toString('hex');

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refresh_token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return { message: 'LOGIN_SUCCESS', access_token, refresh_token };
  }

  async register(user: SignOwnerUpDto) {
    const existingMail = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    const existingPhone = await this.prisma.user.findFirst({
      where: { phone: user.phone },
    });
    if (existingMail || existingPhone) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        fullName: user.fullname,
        email: user.email,
        phone: user.phone,
        password: hashedPassword,
        role: Role.OWNER,
      },
    });

    const EMAILED = await this.newUserMailing.sendWelcomeEmail(newUser.email, user.fullname);
    if (!EMAILED) {
      throw new BadRequestException('Failed to send welcome email');
    }
    return { message: 'USER_CREATED' };
  }

  async verifyEmail(email: string, otp: string) {
    if (!email || !otp) {
      throw new BadRequestException('EMAIL_AND_OTP_REQUIRED');
    }
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const storedOtp = await this.redisClient.get(`mail:${email}`);
    console.log('storedOtp', storedOtp);
    console.log('otp', otp);
    if (!storedOtp) {
      throw new BadRequestException('OTP expired or not found');
    }
    if (storedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
    await this.redisClient.del(`otp:${email}`);

    return { message: 'EMAIL_VERIFIED' };
  }

  async sendOTPthroughMail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }
    const emailed = await this.newUserMailing.sendOTP(email);
    return { message: emailed ? 'OTP_SENT' : 'OTP_NOT_SENT' };
  }

  async sendOTPthroughPhone(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: { phone },
    });
    if (!user) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }
    return { message: 'PHONE_VERIFICATION_NOT_IMPLEMENTED' };
  }

  async updatePassword(user_id: string, data: updatePasswordDto) {
    if (!user_id) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }
    if (!data.password) {
      throw new BadRequestException('PASSWORD_REQUIRED');
    }
    if (!data.email && !data.phone) {
      throw new BadRequestException('PHONE_OR_EMAIL_REQUIRED');
    }

    let user;
    if (data.email) {
      user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
    } else {
      user = await this.prisma.user.findFirst({
        where: { phone: data.phone! },
      });
    }
    if (!user) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }

    const NewPwd = await bcrypt.hash(data.password, 10);
    const updatedUser = await this.prisma.user.update({
      where: { id: Number(user_id) },
      data: { password: NewPwd },
    });
    if (!updatedUser) {
      throw new BadRequestException('Failed to update password');
    }
    return { message: 'PASSWORD_UPDATED' };
  }

  async requestPasswordReset(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }

    const emailed = await this.passwordResetMailing.sendToClient(
      email,
      existingUser.fullName,
    );
    if (!emailed) {
      throw new BadRequestException('FAILED_TO_SEND_PASSWORD_RESET_EMAIL');
    }
    return { message: 'OTP_SENT' };
  }

  async passwordForgotten(email: string, otp: string, newPassword: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }
    const storedOtp = await this.redisClient.get(`mail:${email}`);
    if (!storedOtp) {
      throw new BadRequestException('OTP_EXPIRED_OR_NOT_FOUND');
    }
    if (storedOtp !== otp) {
      throw new BadRequestException('INVALID_OTP');
    }

    await this.redisClient.del(`otp:${email}`);
    const NewPwd = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: existingUser.id },
      data: { password: NewPwd },
    });
    if (!updatedUser) {
      throw new BadRequestException('FAILED_TO_UPDATE_PASSWORD');
    }
    return { message: 'PASSWORD_UPDATED' };
  }

  async logout(user: any) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId: user.user_id },
    });

    if (tokens.length === 0) {
      throw new BadRequestException('TOKEN_NOT_FOUND');
    }

    for (const token of tokens) {
      await this.prisma.refreshToken.delete({ where: { id: token.id } });
    }

    return { message: 'LOGOUT_SUCCESS' };
  }
}
