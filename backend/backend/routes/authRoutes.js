const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  createAdminUser,
  changePassword,
  deleteUserAccount,
  verifyToken,
  getAdmins,
  updateUserRole,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create-admin', createAdminUser);

// Protected routes (require authentication)
router.use(protect); // All routes below this middleware require authentication

// User profile routes
router.route('/profile')
  .get(getUserProfile)
  .put(upload.single('avatar'), updateUserProfile)
  .delete(deleteUserAccount);

// Password management
router.put('/change-password', changePassword);

// Token verification
router.get('/verify', verifyToken);

// Admin only routes
router.get('/admins', admin, getAdmins);
router.put('/users/:id/role', admin, updateUserRole);

module.exports = router;
