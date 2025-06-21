const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
  createCategory,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, upload.array('images', 5), createProduct);
router.route('/categories').get(getCategories).post(protect, admin, upload.single('image'), createCategory);
router.route('/:id').get(getProductById).put(protect, admin, upload.array('images', 5), updateProduct).delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
