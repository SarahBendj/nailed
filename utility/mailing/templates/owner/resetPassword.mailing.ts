import { Injectable, Logger, Inject } from '@nestjs/common';
import { Resend } from 'resend';
import { Redis } from 'ioredis';
import { generateOTP } from 'utility/algo/generate_otp';
import { resetPasswordTemplate } from './resetPassword';

const DEFAULT_FROM = 'Zawadji <no-reply@zawadji.pro>';
const APP_NAME = process.env.APP_NAME ?? 'Zawadji';

@Injectable()
export class PasswordResetMailing {
  private readonly resend = new Resend(process.env.API_KEY_MAIL);
  private readonly logger = new Logger(PasswordResetMailing.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async sendToClient(email: string, name: string): Promise<boolean> {
    try {
      const otp = generateOTP(6);
      await this.redisClient.set(`mail:${email}`, otp, 'EX', 300);

      const response = await this.resend.emails.send({
        from: process.env.MAILER_SENDER ?? process.env.EMAIL_SENDER ?? DEFAULT_FROM,
        to: process.env.PRODUCTION ? email : (process.env.TEST_EMAIL ?? email),
        subject: `Réinitialisation de mot de passe — ${APP_NAME}`,
        html: resetPasswordTemplate(name, otp),
      });

      if (response.error) {
        this.logger.warn(`Password reset email failed for ${email}: ${response.error.message}`);
        return false;
      }
      this.logger.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Password reset email failed for ${email}`, error);
      return false;
    }
  }
}
