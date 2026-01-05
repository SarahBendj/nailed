import { Injectable, Inject } from '@nestjs/common';
import { Resend } from 'resend';
import { generateOTP } from 'utility/algo/generate_otp';
import { Redis } from 'ioredis';

@Injectable()
export class PasswordResetMailing {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {}

  async sendToClient(email: string, name: string): Promise<boolean> {
    const resend = new Resend(process.env.API_KEY_MAIL);
    console.log('Sending email to:', email, 'with name:', name);

    try {
      // Generate OTP
      const otp = generateOTP(6);

      // Save OTP in Redis with 5min TTL
      const block = await this.redisClient.set(`mail:${email}`, otp, 'EX', 30000);
      console.log('OTP saved in Redis:', block);

      // Send email
      await resend.emails.send({
        from: process.env.EMAIL_SENDER || '',
        to: [email],
        subject: 'Password Reset – NAILED',
        html: `
          <div style="background-color: #f7f7f7; font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">
              
              <!-- Header -->
              <div style="background-color: #e6c7ce; padding: 20px; text-align: center;">
                <h1 style="margin: 0; color: #533a3f;">Welcome to NAILED</h1>
              </div>
              
              <!-- Body -->
              <div style="padding: 30px;">
                <p style="font-size: 16px; line-height: 1.6;">
                  Hi <strong>${name}</strong>,
                </p>
                <p style="font-size: 15px; line-height: 1.6; color: #555;">
                  We’re delighted to have you with us at <strong>NAILED</strong>. 
                  To reset your account password, please use the verification code below. 
                  It’s valid for a short time, so be sure to use it soon.
                </p>

                <!-- OTP -->
                <div style="text-align: center; margin: 30px 0;">
                  <h2 style="color: #7a4750; letter-spacing: 2px;">${otp}</h2>
                  <p style="font-size: 13px; color: #888;">This code will expire in 5 minutes.</p>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #555;">
                  If you didn’t request this change, you can safely ignore this email.
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f3f3f3; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                <p>© ${new Date().getFullYear()} NAILED – All rights reserved.</p>
              </div>
            </div>
          </div>
        `,
      });

      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}
