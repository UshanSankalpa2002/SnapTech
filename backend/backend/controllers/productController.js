const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  console.log('Create product request body:', req.body);
  console.log('Files:', req.files);

  const {
    name,
    description,
    price,
    originalPrice,
    category,
    subcategory,
    brand,
    quantity,
    isFeatured
  } = req.body;

  // Validate required fields
  if (!name || !description || !price || !category || !subcategory || !brand) {
    res.status(400);
    throw new Error('Please provide all required fields: name, description, price, category, subcategory, brand');
  }

  // Validate numeric fields
  const parsedPrice = parseFloat(price);
  const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null;
  const parsedQuantity = parseInt(quantity) || 0;

  if (isNaN(parsedPrice) || parsedPrice < 0) {
    res.status(400);
    throw new Error('Price must be a valid positive number');
  }

  if (originalPrice && (isNaN(parsedOriginalPrice) || parsedOriginalPrice < 0)) {
    res.status(400);
    throw new Error('Original price must be a valid positive number');
  }

  // Parse JSON fields that were stringified by FormData
  let specifications = {};
  let features = [];
  let tags = [];

  try {
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      specifications = JSON.parse(req.body.specifications);
    } else if (req.body.specifications && typeof req.body.specifications === 'object') {
      specifications = req.body.specifications;
    }

    if (req.body.features && typeof req.body.features === 'string') {
      features = JSON.parse(req.body.features);
    } else if (req.body.features && Array.isArray(req.body.features)) {
      features = req.body.features;
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      tags = JSON.parse(req.body.tags);
    } else if (req.body.tags && Array.isArray(req.body.tags)) {
      tags = req.body.tags;
    }
  } catch (error) {
    res.status(400);
    throw new Error('Invalid JSON format in specifications, features, or tags');
  }

  // Handle image uploads
  const images = req.files?.map((file) => ({
    url: `/uploads/${file.filename}`,
    alt: name,
  })) || [];

  // Validate that at least one image is provided
  if (images.length === 0) {
    res.status(400);
    throw new Error('At least one product image is required');
  }

  try {
    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      category,
      subcategory,
      brand: brand.trim(),
      images,
      specifications,
      features,
      quantity: parsedQuantity,
      inStock: parsedQuantity > 0,
      tags,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      addedBy: req.user._id,
    });

    const createdProduct = await product.save();
    
    // Populate category info for response
    await createdProduct.populate('category', 'name');
    
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(`Validation Error: ${messages.join(', ')}`);
    }
    
    res.status(500);
    throw new Error('Failed to create product: ' + error.message);
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  console.log('Update product request body:', req.body);
  console.log('Files:', req.files);

  // Parse JSON fields that were stringified by FormData
  let specifications = product.specifications;
  let features = product.features;
  let tags = product.tags;

  try {
    if (req.body.specifications) {
      if (typeof req.body.specifications === 'string') {
        specifications = JSON.parse(req.body.specifications);
      } else if (typeof req.body.specifications === 'object') {
        specifications = req.body.specifications;
      }
    }

    if (req.body.features) {
      if (typeof req.body.features === 'string') {
        features = JSON.parse(req.body.features);
      } else if (Array.isArray(req.body.features)) {
        features = req.body.features;
      }
    }

    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        tags = JSON.parse(req.body.tags);
      } else if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error('Invalid JSON format in specifications, features, or tags');
  }

  // Update fields
  product.name = req.body.name?.trim() || product.name;
  product.description = req.body.description?.trim() || product.description;
  product.price = req.body.price ? parseFloat(req.body.price) : product.price;
  product.originalPrice = req.body.originalPrice ? parseFloat(req.body.originalPrice) : product.originalPrice;
  product.category = req.body.category || product.category;
  product.subcategory = req.body.subcategory || product.subcategory;
  product.brand = req.body.brand?.trim() || product.brand;
  product.specifications = specifications;
  product.features = features;
  product.quantity = req.body.quantity !== undefined ? parseInt(req.body.quantity) : product.quantity;
  product.inStock = product.quantity > 0;
  product.tags = tags;
  product.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      alt: product.name,
    }));
    product.images = [...product.images, ...newImages];
  }

  try {
    const updatedProduct = await product.save();
    await updatedProduct.populate('category', 'name');
    res.json(updatedProduct);
  } catch (error) {
    console.error('Product update error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(`Validation Error: ${messages.join(', ')}`);
    }
    
    res.status(500);
    throw new Error('Failed to update product: ' + error.message);
  }
});

// Keep all other existing functions unchanged...
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { brand: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const subcategory = req.query.subcategory
    ? { subcategory: req.query.subcategory }
    : {};

  const brand = req.query.brand
    ? { brand: { $regex: req.query.brand, $options: 'i' } }
    : {};

  const query = {
    ...keyword,
    ...category,
    ...subcategory,
    ...brand,
    isActive: true,
  };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('reviews.user', 'name avatar');

  if (product && product.isActive) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isActive = false;
    await product.save();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.ratings.count = product.reviews.length;
    product.ratings.average =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, subcategories } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    description,
    subcategories,
    image: req.file ? `/uploads/${req.file.filename}` : '',
  });

  res.status(201).json(category);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
  createCategory,
};