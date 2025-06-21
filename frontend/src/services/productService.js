import api from './api';

const API_URL = '/api/products';

// Get all products
const getProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  const response = await api.get(`${API_URL}?${queryParams.toString()}`);
  return response.data;
};

// Get single product
const getProduct = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

// Get categories
const getCategories = async () => {
  const response = await api.get(`${API_URL}/categories`);
  return response.data;
};

// Create product review
const createReview = async (productId, reviewData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await api.post(`${API_URL}/${productId}/reviews`, reviewData, config);
  return response.data;
};

// Create product (admin only)
const createProduct = async (productData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const formData = new FormData();
    
    // Append text data - handle each field specifically
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price !== undefined) formData.append('price', productData.price.toString());
    if (productData.originalPrice !== undefined && productData.originalPrice !== null) {
      formData.append('originalPrice', productData.originalPrice.toString());
    }
    if (productData.category) formData.append('category', productData.category);
    if (productData.subcategory) formData.append('subcategory', productData.subcategory);
    if (productData.brand) formData.append('brand', productData.brand);
    if (productData.quantity !== undefined) formData.append('quantity', productData.quantity.toString());
    if (productData.isFeatured !== undefined) formData.append('isFeatured', productData.isFeatured.toString());
    
    // Handle complex objects - stringify them
    if (productData.specifications && Object.keys(productData.specifications).length > 0) {
      formData.append('specifications', JSON.stringify(productData.specifications));
    }
    
    if (productData.features && productData.features.length > 0) {
      formData.append('features', JSON.stringify(productData.features));
    }
    
    if (productData.tags && productData.tags.length > 0) {
      formData.append('tags', JSON.stringify(productData.tags));
    }
    
    // Append images if they exist
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    console.log('Sending FormData with the following entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    const response = await api.post(API_URL, formData, config);
    return response.data;
  } catch (error) {
    console.error('Create product service error:', error);
    
    // Extract error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Failed to create product';
    
    throw new Error(errorMessage);
  }
};

// Update product (admin only)
const updateProduct = async (id, productData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const formData = new FormData();
    
    // Append text data - handle each field specifically
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price !== undefined) formData.append('price', productData.price.toString());
    if (productData.originalPrice !== undefined && productData.originalPrice !== null) {
      formData.append('originalPrice', productData.originalPrice.toString());
    }
    if (productData.category) formData.append('category', productData.category);
    if (productData.subcategory) formData.append('subcategory', productData.subcategory);
    if (productData.brand) formData.append('brand', productData.brand);
    if (productData.quantity !== undefined) formData.append('quantity', productData.quantity.toString());
    if (productData.isFeatured !== undefined) formData.append('isFeatured', productData.isFeatured.toString());
    
    // Handle complex objects - stringify them
    if (productData.specifications && Object.keys(productData.specifications).length > 0) {
      formData.append('specifications', JSON.stringify(productData.specifications));
    }
    
    if (productData.features && productData.features.length > 0) {
      formData.append('features', JSON.stringify(productData.features));
    }
    
    if (productData.tags && productData.tags.length > 0) {
      formData.append('tags', JSON.stringify(productData.tags));
    }
    
    // Append new images if they exist
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    console.log('Updating product with FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    const response = await api.put(`${API_URL}/${id}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Update product service error:', error);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Failed to update product';
    
    throw new Error(errorMessage);
  }
};

// Delete product (admin only)
const deleteProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await api.delete(`${API_URL}/${id}`, config);
  return response.data;
};

// Create category (admin only)
const createCategory = async (categoryData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  
  const formData = new FormData();
  
  // Append text data
  Object.keys(categoryData).forEach(key => {
    if (key !== 'image' && categoryData[key] !== undefined) {
      if (typeof categoryData[key] === 'object') {
        formData.append(key, JSON.stringify(categoryData[key]));
      } else {
        formData.append(key, categoryData[key]);
      }
    }
  });
  
  // Append image if exists
  if (categoryData.image && categoryData.image instanceof File) {
    formData.append('image', categoryData.image);
  }
  
  const response = await api.post(`${API_URL}/categories`, formData, config);
  return response.data;
};

const productService = {
  getProducts,
  getProduct,
  getCategories,
  createReview,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
};

export default productService;