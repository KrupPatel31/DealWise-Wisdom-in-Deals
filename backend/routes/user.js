const express = require('express');
const { authenticate } = require('../middlewares/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;