// Email service using Resend for production
// Set RESEND_API_KEY environment variable

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'DealWise <onboarding@resend.dev>';

const sendEmail = async (to, subject, html) => {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set - using mock mode');
    // Sanitize logging - only show email type, not full content or tokens
    const maskedEmail = to ? `${to.substring(0, 3)}***@${to.split('@')[1] || '***'}` : '***';
    console.log(`[MOCK EMAIL] Type: ${subject.split(' - ')[0]}, Recipient: ${maskedEmail}`);
    return { success: true, mock: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data.message || 'Unknown error');
      return { success: false, error: data };
    }

    console.log('Email sent successfully');
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

const emailService = {
  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
          .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DEALWISE</div>
          </div>
          <h1>Verify Your Email Address</h1>
          <p>Thanks for signing up! Please click the button below to verify your email address and activate your account.</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6366f1;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <div class="footer">
            <p>If you didn't create an account with DealWise, you can safely ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} DealWise. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return sendEmail(email, 'Verify Your Email Address - DealWise', html);
  },

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
          .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DEALWISE</div>
          </div>
          <h1>Reset Your Password</h1>
          <p>We received a request to reset your password. Click the button below to choose a new password.</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6366f1;">${resetUrl}</p>
          <div class="warning">
            <strong>⏰ This link expires in 1 hour.</strong><br>
            If you didn't request a password reset, you can safely ignore this email.
          </div>
          <div class="footer">
            <p>For security, this link can only be used once.</p>
            <p>&copy; ${new Date().getFullYear()} DealWise. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return sendEmail(email, 'Reset Your Password - DealWise', html);
  },

  async sendWelcomeEmail(email, name) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
          .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .features { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; }
          .feature { display: flex; align-items: center; margin: 12px 0; }
          .feature-icon { margin-right: 12px; font-size: 20px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DEALWISE</div>
          </div>
          <h1>Welcome to DealWise, ${name}! 🎉</h1>
          <p>Your email has been verified and your account is now active. You're all set to start finding the best deals!</p>
          <div class="features">
            <h3>What you can do now:</h3>
            <div class="feature"><span class="feature-icon">🔍</span> Compare prices across multiple stores</div>
            <div class="feature"><span class="feature-icon">🛒</span> Track products and get price alerts</div>
            <div class="feature"><span class="feature-icon">💰</span> Never overpay again</div>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}" class="button">Start Shopping Smart</a>
          </p>
          <div class="footer">
            <p>Happy deal hunting!</p>
            <p>&copy; ${new Date().getFullYear()} DealWise. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return sendEmail(email, `Welcome to DealWise, ${name}!`, html);
  }
};

// Export both for backward compatibility
module.exports = { 
  emailService,
  mockEmailService: emailService // Alias for existing imports
};