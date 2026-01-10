const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const statsController = require('../Controllers/statsController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// REGISTER (Admin & User bisa via Postman)
router.post('/register', authController.register);

// LOGIN
router.post('/login', authController.login);

// --- STATS & ANALYTICS ---
router.get('/stats', authenticateToken, statsController.getUserStats);

// GET PROFILE
router.get('/profile', authenticateToken, authController.getProfile);

// UPDATE PROFILE
router.put('/profile', authenticateToken, authController.updateProfile);

// CHANGE PASSWORD
router.put('/password', authenticateToken, authController.changePassword);

// RESET API KEY
router.put('/reset-apikey', authenticateToken, authController.resetApiKey);

// ===========================
// ADMIN ROUTES
// ===========================
// GET ALL USERS (Admin Only)
router.get('/admin/users', authenticateToken, isAdmin, authController.getAllUsers);

// DELETE USER (Admin Only)
router.delete('/admin/users/:id', authenticateToken, isAdmin, authController.deleteUser);

module.exports = router;