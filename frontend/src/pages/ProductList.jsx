import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, 
  Search, 
  LayoutGrid, 
  List, 
  SlidersHorizontal,
  ChevronDown,
  X,
  ArrowUpDown
} from 'lucide-react';
import { getProducts, getCategories, setFilters } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Loader';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category, subcategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [localFilters, setLocalFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: category || '',
    subcategory: subcategory || '',
    brand: '',
    sortBy: 'newest',
    priceRange: [0, 200000]
  });

  const { 
    products, 
    categories, 
    isLoading, 
    pagination,
    filters 
  } = useSelector((state) => state.products);

  // Get unique brands from products
  const brands = [...new Set(products.map(product => product.brand))].filter(Boolean);

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  useEffect(() => {
    // Update local filters when URL params change
    const categoryFromUrl = category || '';
    const subcategoryFromUrl = subcategory || '';
    
    // Find category ObjectId from name
    let categoryId = '';
    if (categoryFromUrl && categories.length > 0) {
      const foundCategory = categories.find(cat => 
        cat.name.toLowerCase() === categoryFromUrl.toLowerCase().replace(/-/g, ' ')
      );
      categoryId = foundCategory?._id || '';
    }
    
    setLocalFilters(prev => ({
      ...prev,
      keyword: searchParams.get('keyword') || '',
      category: categoryId,
      subcategory: subcategoryFromUrl
    }));
  }, [category, subcategory, searchParams, categories]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    // Don't make API call until categories are loaded (needed for category ObjectId conversion)
    if (categories.length === 0) return;
    
    // Build query parameters
    const queryParams = {
      keyword: localFilters.keyword,
      category: localFilters.category, // This will now be ObjectId
      subcategory: localFilters.subcategory,
      brand: localFilters.brand,
      pageNumber: 1,
      pageSize: 12
    };

    // Remove empty values
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key]) {
        delete queryParams[key];
      }
    });

    dispatch(getProducts(queryParams));
    dispatch(setFilters(queryParams));
  }, [dispatch, localFilters, categories.length]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const keyword = formData.get('keyword');
    
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const clearFilters = () => {
    setLocalFilters({
      keyword: '',
      category: '',
      subcategory: '',
      brand: '',
      sortBy: 'newest',
      priceRange: [0, 200000]
    });
    navigate('/products');
  };

  const getCurrentCategory = () => {
    if (category) {
      // Find category by name from URL (handle dashes converted to spaces)
      return categories.find(cat => 
        cat.name.toLowerCase() === category.toLowerCase().replace(/-/g, ' ')
      );
    } else if (localFilters.category) {
      // Find category by ObjectId from filters
      return categories.find(cat => cat._id === localFilters.category);
    }
    return null;
  };

  const currentCategory = getCurrentCategory();
  const subcategoriesInCategory = currentCategory?.subcategories || [];

  // Filter products based on sort
  const sortedProducts = [...products].sort((a, b) => {
    switch (localFilters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category ? (
                  <>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {subcategory && (
                      <span className="text-blue-600"> / {subcategory}</span>
                    )}
                  </>
                ) : localFilters.category ? (
                  <>
                    {getCurrentCategory()?.name || 'Products'}
                    {localFilters.subcategory && (
                      <span className="text-blue-600"> / {localFilters.subcategory}</span>
                    )}
                  </>
                ) : (
                  'All Products'
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {localFilters.keyword ? (
                  <>Search results for "{localFilters.keyword}"</>
                ) : (
                  <>Discover amazing products at great prices</>
                )}
              </p>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  name="keyword"
                  type="text"
                  defaultValue={localFilters.keyword}
                  placeholder="Search products..."
                  className="w-80 px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                name="keyword"
                type="text"
                defaultValue={localFilters.keyword}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {(showFilters || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
                >
                  {/* Clear Filters */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <label key={cat._id} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={cat._id}
                            checked={localFilters.category === cat._id}
                            onChange={(e) => {
                              handleFilterChange('category', e.target.value);
                              handleFilterChange('subcategory', '');
                            }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Subcategories */}
                  {subcategoriesInCategory.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Subcategories</h4>
                      <div className="space-y-2">
                        {subcategoriesInCategory.map((subcat) => (
                          <label key={subcat.name} className="flex items-center">
                            <input
                              type="radio"
                              name="subcategory"
                              value={subcat.name}
                              checked={localFilters.subcategory === subcat.name}
                              onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">{subcat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brands */}
                  {brands.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {brands.map((brand) => (
                          <label key={brand} className="flex items-center">
                            <input
                              type="radio"
                              name="brand"
                              value={brand}
                              checked={localFilters.brand === brand}
                              onChange={(e) => handleFilterChange('brand', e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {pagination.total} products found
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading || categories.length === 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {[...Array(12)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div
                layout
                className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}
              >
                <AnimatePresence>
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  {[...Array(pagination.pages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          // Handle pagination
                          const queryParams = {
                            ...localFilters,
                            pageNumber: pageNum
                          };
                          dispatch(getProducts(queryParams));
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                          pageNum === pagination.page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;