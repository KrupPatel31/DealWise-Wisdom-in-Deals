const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/database');
const { validateRegister, validateLogin, validatePasswordReset } = require('../utils/validation');
const { hashToken, generateToken } = require('../utils/tokenUtils');
const { mockEmailService } = require('../utils/emailService');

const authController = {
  async register(req, res) {
    try {
      const { error, value } = validateRegister(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password, full_name } = value;

      // Check if user already exists
      const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const userResult = await db.query(
        'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
        [email, passwordHash, full_name]
      );

      const user = userResult.rows[0];

      // Generate email verification token
      const verificationToken = generateToken();
      const tokenHash = hashToken(verificationToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await db.query(
        'INSERT INTO tokens (user_id, token_hash, type, expires_at) VALUES ($1, $2, $3, $4)',
        [user.id, tokenHash, 'email_verification', expiresAt]
      );

      // Send verification email (mock)
      await mockEmailService.sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
        user: { id: user.id, email: user.email, full_name: user.full_name }
      });
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async login(req, res) {
    try {
      const { error, value } = validateLogin(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password } = value;

      // Get user
      const userResult = await db.query(
        'SELECT id, email, password_hash, full_name, email_verified FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = userResult.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      const refreshToken = generateToken();
      const refreshTokenHash = hashToken(refreshToken);
      const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Store refresh token
      await db.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
        [user.id, refreshTokenHash, refreshExpiresAt]
      );

      // Set refresh token cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          email_verified: user.email_verified
        }
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not provided' });
      }

      const tokenHash = hashToken(refreshToken);

      // Verify refresh token
      const tokenResult = await db.query(
        'SELECT rt.user_id, u.email FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token_hash = $1 AND rt.expires_at > NOW()',
        [tokenHash]
      );

      if (tokenResult.rows.length === 0) {
        res.clearCookie('refreshToken');
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }

      const { user_id, email } = tokenResult.rows[0];

      // Delete old refresh token
      await db.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);

      // Generate new tokens
      const accessToken = jwt.sign(
        { userId: user_id, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      const newRefreshToken = generateToken();
      const newRefreshTokenHash = hashToken(newRefreshToken);
      const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Store new refresh token
      await db.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
        [user_id, newRefreshTokenHash, refreshExpiresAt]
      );

      // Set new refresh token cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({ accessToken });
    } catch (error) {
      console.error('Refresh error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      
      if (refreshToken) {
        const tokenHash = hashToken(refreshToken);
        await db.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
      }

      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const userResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      
      // Always return success to prevent email enumeration
      if (userResult.rows.length === 0) {
        return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }

      const userId = userResult.rows[0].id;

      // Delete existing password reset tokens
      await db.query('DELETE FROM tokens WHERE user_id = $1 AND type = $2', [userId, 'password_reset']);

      // Generate reset token
      const resetToken = generateToken();
      const tokenHash = hashToken(resetToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.query(
        'INSERT INTO tokens (user_id, token_hash, type, expires_at) VALUES ($1, $2, $3, $4)',
        [userId, tokenHash, 'password_reset', expiresAt]
      );

      // Send reset email (mock)
      await mockEmailService.sendPasswordResetEmail(email, resetToken);

      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
      console.error('Password reset request error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async resetPassword(req, res) {
    try {
      const { error, value } = validatePasswordReset(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { token, password } = value;
      const tokenHash = hashToken(token);

      // Verify token
      const tokenResult = await db.query(
        'SELECT user_id FROM tokens WHERE token_hash = $1 AND type = $2 AND expires_at > NOW() AND used = FALSE',
        [tokenHash, 'password_reset']
      );

      if (tokenResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const userId = tokenResult.rows[0].user_id;

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 12);

      // Update password and mark token as used
      await db.query('BEGIN');
      try {
        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
        await db.query('UPDATE tokens SET used = TRUE WHERE token_hash = $1', [tokenHash]);
        await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]); // Invalidate all sessions
        await db.query('COMMIT');

        res.json({ message: 'Password reset successfully' });
      } catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('Password reset error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ error: 'Verification token is required' });
      }

      const tokenHash = hashToken(token);

      // Verify token
      const tokenResult = await db.query(
        'SELECT user_id FROM tokens WHERE token_hash = $1 AND type = $2 AND expires_at > NOW() AND used = FALSE',
        [tokenHash, 'email_verification']
      );

      if (tokenResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      const userId = tokenResult.rows[0].user_id;

      // Update user and mark token as used
      await db.query('BEGIN');
      try {
        await db.query('UPDATE users SET email_verified = TRUE WHERE id = $1', [userId]);
        await db.query('UPDATE tokens SET used = TRUE WHERE token_hash = $1', [tokenHash]);
        await db.query('COMMIT');

        res.json({ message: 'Email verified successfully' });
      } catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('Email verification error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;