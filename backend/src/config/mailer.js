import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Gmail SMTP transporter with explicit secure connection and short timeouts
export const mailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  connectionTimeout: 5000, // 5 seconds max connection wait
  greetingTimeout: 5000,
  socketTimeout: 5000,
  auth: {
    user: (process.env.SMTP_USER || 'zeeshandivanextechnologies@gmail.com').trim(),
    pass: (process.env.SMTP_PASS || 'mabzjajxcwdfymgx').replace(/\s+/g, ''),
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Send 6-Digit Airbnb OTP Email
 */
export async function sendOtpEmail(toEmail, otpCode) {
  const digits = String(otpCode || '').padStart(6, '0').split('');

  const digitBoxesHtml = digits.map(d => `
    <td style="padding: 0 4px;">
      <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; width: 36px; height: 42px; line-height: 42px; text-align: center; font-size: 20px; font-weight: 700; color: #222222; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
        ${d}
      </div>
    </td>
  `).join('');

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Airbnb" <zeeshandivanextechnologies@gmail.com>',
    to: toEmail,
    subject: `${otpCode} is your Airbnb verification code`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Here’s your Airbnb code</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #f7f7f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e8e8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <!-- Airbnb Logo (Bélo) -->
              <div style="margin-bottom: 32px;">
                <svg width="34" height="38" viewBox="0 0 32 32" fill="#FF385C" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                  <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533.993c2.428 4.604 5.385 10.428 6.438 12.875 1.188 2.76 1.778 5.161 1.778 7.238 0 3.738-2.887 6.625-6.625 6.625-2.478 0-4.636-1.285-5.875-3.328-1.239 2.043-3.397 3.328-5.875 3.328-3.738 0-6.625-2.887-6.625-6.625 0-2.077.59-4.478 1.778-7.238 1.053-2.447 4.01-8.271 6.438-12.875l.533-.993C10.537 1.963 11.992 1 16 1zm0 3c-2.446 0-3.411 1.042-4.484 2.969l-.534.993c-2.396 4.545-5.327 10.32-6.368 12.739-1.04 2.417-1.614 4.582-1.614 6.424 0 2.222 1.778 4 4 4 1.838 0 3.407-1.218 3.876-2.991l.124-.551c.362-1.849 1.488-5.382 5-5.382s4.638 3.533 5 5.382l.124.551c.469 1.773 2.038 2.991 3.876 2.991 2.222 0 4-1.778 4-4 0-1.842-.574-4.007-1.614-6.424-1.041-2.419-3.972-8.194-6.368-12.739l-.534-.993C19.411 5.042 18.446 4 16 4zm0 14c-1.657 0-3 1.343-3 3 0 1.258.775 2.336 1.874 2.766l.376.119.375-.119c1.099-.43 1.875-1.508 1.875-2.766 0-1.657-1.343-3-3-3z"/>
                </svg>
              </div>

              <!-- Main Title -->
              <h1 style="color: #222222; font-size: 28px; font-weight: 700; line-height: 1.25; margin: 0 0 16px 0; letter-spacing: -0.5px;">
                Here’s your Airbnb code
              </h1>

              <!-- Warning text -->
              <p style="color: #222222; font-size: 16px; line-height: 1.5; margin: 0 0 28px 0;">
                Never share your confirmation code with anyone – Airbnb employees will never ask for it.
              </p>

              <!-- Main Large Code -->
              <div style="font-size: 38px; font-weight: 800; color: #222222; letter-spacing: 2px; margin: 0 0 36px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                ${otpCode}
              </div>

              <!-- Code Requested Card with Copy action -->
              <div style="background-color: #f0f5fa; border-radius: 12px; padding: 20px 24px; margin: 0 0 40px 0;">
                <div style="font-size: 14px; font-weight: 600; color: #222222; margin-bottom: 12px;">
                  Code Requested
                </div>
                <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                  <tr>
                    ${digitBoxesHtml}
                  </tr>
                </table>
                <div>
                  <a href="#" style="display: inline-block; background-color: #0d5f9e; color: #ffffff; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 24px; text-decoration: none; font-family: inherit;">
                    Copy code
                  </a>
                </div>
              </div>

              <!-- Don't recognise this? -->
              <div style="margin-top: 10px;">
                <h2 style="color: #222222; font-size: 19px; font-weight: 700; margin: 0 0 10px 0;">
                  Don't recognise this?
                </h2>
                <p style="color: #222222; font-size: 15px; line-height: 1.5; margin: 0;">
                  Let us know – we’ll help secure and <a href="http://localhost:5173/account-settings" style="color: #222222; font-weight: 700; text-decoration: underline;">review your account</a>. Otherwise, no action is required.
                </p>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #ebebeb; margin: 0;">
            </td>
          </tr>

          <!-- Footer with Logo and Social Links -->
          <tr>
            <td style="padding: 32px 40px 36px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <!-- Airbnb Red Icon -->
                    <svg width="28" height="32" viewBox="0 0 32 32" fill="#FF385C" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                      <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533.993c2.428 4.604 5.385 10.428 6.438 12.875 1.188 2.76 1.778 5.161 1.778 7.238 0 3.738-2.887 6.625-6.625 6.625-2.478 0-4.636-1.285-5.875-3.328-1.239 2.043-3.397 3.328-5.875 3.328-3.738 0-6.625-2.887-6.625-6.625 0-2.077.59-4.478 1.778-7.238 1.053-2.447 4.01-8.271 6.438-12.875l.533-.993C10.537 1.963 11.992 1 16 1zm0 3c-2.446 0-3.411 1.042-4.484 2.969l-.534.993c-2.396 4.545-5.327 10.32-6.368 12.739-1.04 2.417-1.614 4.582-1.614 6.424 0 2.222 1.778 4 4 4 1.838 0 3.407-1.218 3.876-2.991l.124-.551c.362-1.849 1.488-5.382 5-5.382s4.638 3.533 5 5.382l.124.551c.469 1.773 2.038 2.991 3.876 2.991 2.222 0 4-1.778 4-4 0-1.842-.574-4.007-1.614-6.424-1.041-2.419-3.972-8.194-6.368-12.739l-.534-.993C19.411 5.042 18.446 4 16 4zm0 14c-1.657 0-3 1.343-3 3 0 1.258.775 2.336 1.874 2.766l.376.119.375-.119c1.099-.43 1.875-1.508 1.875-2.766 0-1.657-1.343-3-3-3z"/>
                    </svg>
                  </td>
                  <td align="right" valign="middle">
                    <!-- Social icons: Instagram, TikTok, YouTube, X -->
                    <table border="0" cellpadding="0" cellspacing="0" style="display: inline-table;">
                      <tr>
                        <!-- Instagram -->
                        <td style="padding-left: 14px;">
                          <a href="https://www.instagram.com/airbnb" style="text-decoration: none; color: #222222; display: inline-block;">
                            <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="20" height="20" alt="Instagram" style="display: block; border: 0; filter: grayscale(100%); opacity: 0.85;" />
                          </a>
                        </td>
                        <!-- TikTok -->
                        <td style="padding-left: 14px;">
                          <a href="https://www.tiktok.com/@airbnb" style="text-decoration: none; color: #222222; display: inline-block;">
                            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" height="20" alt="TikTok" style="display: block; border: 0; filter: grayscale(100%); opacity: 0.85;" />
                          </a>
                        </td>
                        <!-- YouTube -->
                        <td style="padding-left: 14px;">
                          <a href="https://www.youtube.com/airbnb" style="text-decoration: none; color: #222222; display: inline-block;">
                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="20" height="20" alt="YouTube" style="display: block; border: 0; filter: grayscale(100%); opacity: 0.85;" />
                          </a>
                        </td>
                        <!-- X (Twitter) -->
                        <td style="padding-left: 14px;">
                          <a href="https://twitter.com/airbnb" style="text-decoration: none; color: #222222; display: inline-block;">
                            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20" alt="X" style="display: block; border: 0; filter: grayscale(100%); opacity: 0.85;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Address details -->
              <div style="margin-top: 24px; font-size: 13px; color: #717171; line-height: 1.45;">
                <div style="color: #222222; margin-bottom: 2px;">Airbnb Ireland UC</div>
                <div>
                  <a href="https://maps.google.com/?q=8+Hanover+Quay+Dublin+2+Ireland" style="color: #0066cc; text-decoration: underline;">8 Hanover Quay</a>
                </div>
                <div>
                  <a href="https://maps.google.com/?q=Dublin+2+Ireland" style="color: #0066cc; text-decoration: underline;">Dublin 2, Ireland</a>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`✅ Real OTP Email sent to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${toEmail}:`, error.message);
    throw error;
  }
}
