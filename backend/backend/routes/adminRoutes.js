const express = require('express');
const {
  getDashboardStats,
  getUsers,
  deleteUser,
  updateUser,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser).put(updateUser);

module.exports = router;
