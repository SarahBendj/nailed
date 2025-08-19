import { Resend } from 'resend';

export class NewUserMailing {
  static async sendNewUserEmail(email: string, name: string): Promise<boolean> {
    const resend = new Resend(process.env.API_KEY_MAIL);

    try {
      await resend.emails.send({
        from: process.env.EMAIL_SENDER || '',
        to: [email],
        subject: 'WELCOME TO NAILED 💅',
        html: `
          <div style="background-color: #f5e6f7; font-family: 'Segoe UI', sans-serif; padding: 40px; color: #4a004e;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
              <div style="background-color: #d6b3e3; padding: 20px; text-align: center;">
                <h1 style="margin: 0; color: #4a004e;">💅 Welcome to NAILED 💖</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; line-height: 1.6;">
                  Hey <strong>${name}</strong>,<br><br>
                  We’re absolutely thrilled to have you join <strong>NAILED</strong> — where glam, sparkle, and self-love come together! ✨
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                  Get ready for exclusive tips, irresistible offers, and the most fabulous nail inspo delivered right to your inbox. Whether you're into classy nudes or bold glitter bombs, you're in the right place. 💜
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                  Sit back, relax, and let us spoil you with everything that makes nails magical. Your journey to flawless fingertips starts now. Welcome to the NAILED family — we’re so excited you’re here! 💅💫
                </p>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://nailed.com" style="background-color: #b263c4; color: white; text-decoration: none; padding: 12px 24px; border-radius: 25px; font-weight: bold;">
                    Explore Now 💖
                  </a>
                </div>
              </div>
            </div>
            <p style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
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
