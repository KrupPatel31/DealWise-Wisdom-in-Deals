const db = require('../config/database');

const userController = {
  async getProfile(req, res) {
    try {
      const userResult = await db.query(
        'SELECT id, email, full_name, email_verified, created_at FROM users WHERE id = $1',
        [req.user.userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: userResult.rows[0] });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateProfile(req, res) {
    try {
      const { full_name } = req.body;
      
      if (!full_name || full_name.trim().length === 0) {
        return res.status(400).json({ error: 'Full name is required' });
      }

      const userResult = await db.query(
        'UPDATE users SET full_name = $1 WHERE id = $2 RETURNING id, email, full_name, email_verified',
        [full_name.trim(), req.user.userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ 
        message: 'Profile updated successfully',
        user: userResult.rows[0] 
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController;