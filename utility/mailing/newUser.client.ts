import { Injectable, Inject } from '@nestjs/common';
import { Resend } from 'resend';
import { generateOTP } from 'utility/algo/generate_otp';
import { Redis } from 'ioredis';

@Injectable()
export class NewUserMailing {
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
      await this.redisClient.set(`mail:${email}`, otp, 'EX', 300);

      // Send email
      await resend.emails.send({
        from: process.env.EMAIL_SENDER || '',
        to: [email],
        subject: 'WELCOME TO NAILED 💅',
        html: `
          <div style="background-color: #F2E8EB; font-family: 'Segoe UI', sans-serif; padding: 40px; color: #111111;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <div style="background-color: #EBADB8; padding: 20px; text-align: center;">
                <h1 style="margin: 0; color: #694048;">💅 Welcome to NAILED 💖</h1>
              </div>
              
              <!-- Body -->
              <div style="padding: 30px;">
                <p style="font-size: 16px; line-height: 1.6; color: #50555C;">
                  Hey <strong>${name}</strong>,<br><br>
                  We’re absolutely thrilled to have you join <strong>NAILED</strong> — where glam, sparkle, and self-love come together! ✨
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #50555C;">
                  Get ready for exclusive tips, irresistible offers, and the most fabulous nail inspo delivered right to your inbox. Whether you're into classy nudes or bold glitter bombs, you're in the right place. 💜
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #50555C;">
                  Sit back, relax, and let us spoil you with everything that makes nails magical. Your journey to flawless fingertips starts now. Welcome to the NAILED family — we’re so excited you’re here! 💅💫
                </p>
                
                <!-- OTP -->
                <div style="text-align: center; margin-top: 30px;">
                  <h2 style="color: #8F5761;">Activate your account with this code: <strong>${otp}</strong></h2>
                  
                  <!-- CTA Button -->
                  <a href="https://nailed.com" style="display: inline-block; background-color: #8F5761; color: white; text-decoration: none; padding: 12px 24px; border-radius: 25px; font-weight: bold; margin-top: 20px;">
                    Explore Now 💖
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <p style="text-align: center; font-size: 12px; color: #ADB3BC; margin-top: 20px;">
              You received this email because you signed up for NAILED. If this wasn't you, please ignore this message.
            </p>
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
