import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AddProduct from '../pages/AddProduct';
import ManageOrders from '../pages/ManageOrders';

// Import Components
import ProtectedRoute from '../components/ProtectedRoute';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

// Page wrapper with animation
const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <PageWrapper>
            <Home />
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/about" 
        element={
          <PageWrapper>
            <About />
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/services" 
        element={
          <PageWrapper>
            <Services />
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/login" 
        element={
          <PageWrapper>
            <Login />
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PageWrapper>
            <Register />
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/products" 
        element={
          <PageWrapper>
            <ProductList />
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/products/:id" 
        element={
          <PageWrapper>
            <ProductDetail />
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/category/:category" 
        element={
          <PageWrapper>
            <ProductList />
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/category/:category/:subcategory" 
        element={
          <PageWrapper>
            <ProductList />
          </PageWrapper>
        } 
      />

      {/* Protected User Routes */}
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <PageWrapper>
              <Cart />
            </PageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <PageWrapper>
              <Checkout />
            </PageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <PageWrapper>
              <UserDashboard />
            </PageWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Protected Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminRequired={true}>
            <PageWrapper>
              <AdminDashboard />
            </PageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/products/add" 
        element={
          <ProtectedRoute adminRequired={true}>
            <PageWrapper>
              <AddProduct />
            </PageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/products/edit/:id" 
        element={
          <ProtectedRoute adminRequired={true}>
            <PageWrapper>
              <AddProduct />
            </PageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/orders" 
        element={
          <ProtectedRoute adminRequired={true}>
            <PageWrapper>
              <ManageOrders />
            </PageWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Catch-all route - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;