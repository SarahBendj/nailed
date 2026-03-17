import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  logoutDto,
  SignInOwnerDto,
  SignOwnerUpDto,
  SO_SignUpDto,
  updatePasswordDto,
} from './dto/sign.user.dto';
import { Public } from 'src/common/decorators/public.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt.guards';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@Throttle({ default: { limit: 5, ttl: 60000 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/owner/signin')
  @Public()
  async signup(@Body() body: SignInOwnerDto) {
    const { phone, password } = body;
    if (!phone || !password) {
      return { message: 'PHONE_PASSWORD_REQUIRED' };
    }
    const user = await this.authService.validateUser(phone, password);
    if (!user) {
      return { message: 'PHONE_OR_PASSWORD_INVALID' };
    }
    return this.authService.login(user);
  }

  @Post('owner/signup')
  @Public()
  async register(@Body() body: SignOwnerUpDto) {
    const { email, phone, password, fullname } = body;
    if (!email || !phone || !password || !fullname) {
      return { message: 'ALL_FIELDS_REQUIRED' };
    }
    return this.authService.register(body);
  }

  @Post('owner/verify-email')
  @Public()
  async consentTerms(@Body() body: { email: string; otp: string }) {
    const { email, otp } = body;
    const response = await this.authService.verifyEmail(email, otp);
    return response;
  }

    @Post('owner/verify-phone')
    @Public()
    async verifyPhone(@Body() body: { phone: string; otp: string }) {
      const { phone, otp } = body;
      console.log('phone and otp', phone, otp);

      return {
        message: 'PHONE_VERIFICATION_NOT_IMPLEMENTED',
      };
    }

  @Post('owner/request-verify-email')
  @Public()
  async sendNewOtp(@Body() body: { email: string }) {
    const { email } = body;
    if (!email) {
      return { message: 'EMAIL_REQUIRED' };
    }
    return this.authService.sendOTPthroughMail(email);
  }


   @Post('owner/request-verify-phone')
  @Public()
  async sendNewOtpBySMPP(@Body() body: { phone: string }) {
    const { phone } = body;
    if (!phone) {
      return { message: 'PHONE_REQUIRED' };
    }
    return this.authService.sendOTPthroughPhone(phone);
  }


  @UseGuards(JwtAuthGuard)
  @Put('owner/update-password')
  async updatePassword(@Req() request, @Body() body: updatePasswordDto) {
    const idFromToken = request.user.user_id;
    return this.authService.updatePassword(idFromToken, body);
  }

  @Public()
  @Post('owner/request-password-reset')
  async requestPasswordReset(@Body() body: { email: string }) {
    const { email } = body;
    if (!email) {
      return { message: 'EMAIL_REQUIRED' };
    }
    return this.authService.requestPasswordReset(email);
  }

  @Public()
  @Put('owner/password-reset')
  async passwordForgotten(
    @Body() body: { email: string; otp: string; password: string },
  ) {
    const { email, otp, password } = body;
    if (!email || !otp || !password) {
      return { message: 'EMAIL_OTP_PASSWORD_REQUIRED' };
    }
    return this.authService.passwordForgotten(email, otp, password);
  }
  @UseGuards(JwtAuthGuard)
  @Post('owner/logout')
  @HttpCode(200)
  async logout(@Req() request) {
    const userFromToken = request.user;
    if (!userFromToken) {
      return { message: 'TOKEN_REQUIRED' };
    }
    await this.authService.logout(userFromToken);
    return { message: 'LOGOUT_SUCCESS' };
  }

  
}
