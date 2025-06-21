import { createSlice } from '@reduxjs/toolkit';

// Get cart from localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cartItems) => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
};

// Calculate cart totals
const calculateCartTotals = (cartItems) => {
  const itemsPrice = cartItems.reduce(
    (acc, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + (price * quantity);
    },
    0
  );
  
  const shippingPrice = itemsPrice > 1000 ? 0 : 100; // Free shipping over ₹1000
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice,
    taxPrice,
    totalPrice: Number(totalPrice.toFixed(2)),
  };
};

const initialState = {
  cartItems: getCartFromStorage(),
  shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || {},
  paymentMethod: localStorage.getItem('paymentMethod') || '',
  ...calculateCartTotals(getCartFromStorage()),
  isLoading: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        // Update quantity if item already exists
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product
            ? { ...x, quantity: x.quantity + item.quantity }
            : x
        );
      } else {
        // Add new item
        state.cartItems.push(item);
      }

      // Recalculate totals
      const totals = calculateCartTotals(state.cartItems);
      state.itemsPrice = totals.itemsPrice;
      state.shippingPrice = totals.shippingPrice;
      state.taxPrice = totals.taxPrice;
      state.totalPrice = totals.totalPrice;

      // Save to localStorage
      saveCartToStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);

      // Recalculate totals
      const totals = calculateCartTotals(state.cartItems);
      state.itemsPrice = totals.itemsPrice;
      state.shippingPrice = totals.shippingPrice;
      state.taxPrice = totals.taxPrice;
      state.totalPrice = totals.totalPrice;

      // Save to localStorage
      saveCartToStorage(state.cartItems);
    },

    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        state.cartItems = state.cartItems.filter((x) => x.product !== productId);
      } else {
        // Update quantity
        state.cartItems = state.cartItems.map((x) =>
          x.product === productId ? { ...x, quantity } : x
        );
      }

      // Recalculate totals
      const totals = calculateCartTotals(state.cartItems);
      state.itemsPrice = totals.itemsPrice;
      state.shippingPrice = totals.shippingPrice;
      state.taxPrice = totals.taxPrice;
      state.totalPrice = totals.totalPrice;

      // Save to localStorage
      saveCartToStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      
      localStorage.removeItem('cart');
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },

    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = '';
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      
      localStorage.removeItem('cart');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
    },

    recalculateCartTotals: (state) => {
      const totals = calculateCartTotals(state.cartItems);
      state.itemsPrice = totals.itemsPrice;
      state.shippingPrice = totals.shippingPrice;
      state.taxPrice = totals.taxPrice;
      state.totalPrice = totals.totalPrice;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
  resetCart,
  recalculateCartTotals,
} = cartSlice.actions;

export default cartSlice.reducer;