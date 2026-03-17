import { Injectable, Logger, Inject } from '@nestjs/common';
import { Resend } from 'resend';
import { generateOTP } from 'utility/algo/generate_otp';
import { Redis } from 'ioredis';
import { welcomeTemplate } from '../owner/welcome.template';
import { SendOtpTemplate } from '../owner/sendOtp.template';

@Injectable()
export class UserMailingService {
  private readonly resend = new Resend(process.env.API_KEY_MAIL);
  private readonly logger = new Logger(UserMailingService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  /**
   * Envoie un OTP à l'utilisateur et le sauvegarde dans Redis
   */
  async sendOTP(email: string): Promise<string> {
    try {
      const otp = generateOTP(6);
      // TTL en secondes (ici 5 minutes)
        await this.redisClient.set(`mail:${email}`, otp, 'EX', 300);
        await this.resend.emails.send({
        from: process.env.EMAIL_SENDER ?? 'Zawadji <no-reply@zawadji.pro>',
        to: email,
        subject: 'Votre code de vérification ',
        html: SendOtpTemplate(otp),
      });
      this.logger.log(`OTP généré et sauvegardé pour ${email}: ${otp}`);
      return otp;
    } catch (error) {
      this.logger.error(`Erreur lors de l'enregistrement de l'OTP pour ${email}`, error);
      throw error;
    }
  }

  /**
   * Envoie un email de bienvenue à un utilisateur
   */
  async sendWelcomeEmail(email: string, name: string): Promise<Boolean> {
    try {
      const otp = generateOTP(6);
      await this.redisClient.set(`mail:${email}`, otp, 'EX', 300);
      await this.resend.emails.send({
        from: process.env.EMAIL_SENDER ?? 'Zawadji-gerant <no-reply@zawadji.pro>',
        to: email,
        subject: `Bienvenue sur ${process.env.APP_NAME}`,
        html: welcomeTemplate(name ,otp)
      });

      this.logger.log(`Email de bienvenue envoyé à ${email}`);
      return true
    } catch (error) {
      this.logger.error(`Échec de l'envoi de l'email à ${email}`, error);
      return false
      
    }
  }

  /**
   * Combinaison : envoie OTP et email de bienvenue
   */
  async registerNewUser(email: string, name: string): Promise<void> {
    const otp = await this.sendOTP(email);
    await this.sendWelcomeEmail(email, name);
    this.logger.log(`Nouvel utilisateur enregistré : ${email}, OTP: ${otp}`);
  }
}
