const APP_NAME = process.env.APP_NAME ?? 'Zawadji';

export const resetPasswordTemplate = (name: string, otp: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Réinitialisation mot de passe — ${APP_NAME}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    .email-container { background-color: #fdfbf7; }
    .text-primary { color: #2c2416; }
    .text-secondary { color: #5c5344; }
    @media (prefers-color-scheme: dark) {
      .email-container { background-color: #1a1814 !important; }
      .text-primary { color: #f5f0e6 !important; }
      .text-secondary { color: #b8b0a0 !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background: linear-gradient(180deg, #faf6f0 0%, #f0ebe3 100%); font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #faf6f0 0%, #f0ebe3 100%);">
    <tr>
      <td align="center" style="padding: 48px 24px;">

        <table class="email-container" width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px; background-color:#fdfbf7; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(201, 162, 39, 0.08); border: 1px solid rgba(201, 162, 39, 0.2);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align:center;">
              <img
                src="${process.env.R2_DISPLAY_PUBLIC_URL || ''}/zawadji/zawadji_foreground.png"
                alt="Zawadji"
                width="56"
                height="56"
                style="display:block; margin:0 auto;"
              />
              <div style="height:16px;"></div>
              <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a227;">Salles de fêtes & cérémonies</span>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td align="center" style="padding: 0 40px;">
              <table align="center" cellpadding="0" cellspacing="0" style="width: 80px;">
                <tr><td style="height: 1px; background: linear-gradient(90deg, transparent, #c9a227, transparent);"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 24px 40px 40px;">
              <h1 class="text-primary" style="margin:0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 600; line-height: 1.25; color: #2c2416;">
                Réinitialisation de mot de passe
              </h1>
              <p class="text-secondary" style="margin:0 0 24px 0; font-size: 15px; line-height: 1.6; color: #5c5344;">
                Bonjour ${name}, utilisez le code ci-dessous pour réinitialiser votre mot de passe sur ${APP_NAME} :
              </p>

              <!-- OTP — golden rounded box -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" align="center" style="border: 2px solid #c9a227; border-radius: 12px; background-color: #fefdfb;">
                      <tr>
                        <td style="padding: 20px 32px; font-size: 26px; font-weight: 600; letter-spacing: 8px; color: #2c2416; font-family: 'Outfit', monospace;">
                          ${otp}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p class="text-secondary" style="margin:0; font-size: 13px; line-height: 1.5; color: #5c5344;">
                Ce code expire dans 5 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 40px; text-align:center; font-size: 12px; color: #8a8178; border-top: 1px solid rgba(201, 162, 39, 0.2);">
              — La team Zawadji<br/>
              Salles de fêtes & cérémonies<br/>
              📩 contact@zawadji-gerant.pro<br/>
              © ${new Date().getFullYear()} ${APP_NAME} — Tous droits réservés
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
