import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

const DEFAULT_FROM = 'Zawadji <no-reply@zawadji.pro>';

@Injectable()
export class ZawadjiMailing {
  private readonly resend = new Resend(process.env.API_KEY_MAIL);
  private readonly logger = new Logger(ZawadjiMailing.name);

  private get from(): string {
    return process.env.MAILER_SENDER ?? process.env.EMAIL_SENDER ?? DEFAULT_FROM;
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const response = await this.resend.emails.send({
      from: this.from,
      to: process.env.PRODUCTION ? to : (process.env.TEST_EMAIL ?? to),
      subject,
      html,
    });

    if (response.error) {
      this.logger.warn(`Email failed for ${to}: ${response.error.message}`);
      throw new Error(response.error.message ?? 'Resend error');
    }
    this.logger.log(`Email sent to ${to}`);
  }
}
