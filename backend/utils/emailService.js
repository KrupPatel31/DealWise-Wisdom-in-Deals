// Mock email service for development
// Replace with real email service (SendGrid, Mailgun, etc.) in production

const mockEmailService = {
  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    console.log(`
    =====================================
    EMAIL VERIFICATION (MOCK)
    =====================================
    To: ${email}
    Subject: Verify Your Email Address
    
    Please click the link below to verify your email address:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    =====================================
    `);
    
    return { success: true };
  },

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    console.log(`
    =====================================
    PASSWORD RESET (MOCK)
    =====================================
    To: ${email}
    Subject: Reset Your Password
    
    Please click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour.
    =====================================
    `);
    
    return { success: true };
  }
};

module.exports = { mockEmailService };