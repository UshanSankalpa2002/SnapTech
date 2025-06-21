import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  MapPin,
  CreditCard,
  MessageSquare,
  Hash,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { getAllOrders, updateOrderStatus, reset } from '../redux/slices/orderSlice';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const ManageOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderStatusData, setOrderStatusData] = useState({
    status: '',
    message: '',
    trackingNumber: ''
  });

  const { allOrders, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
      setShowStatusModal(false);
      setSelectedOrder(null);
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const orderStatuses = [
    { value: 'all', label: 'All Orders', color: 'bg-gray-100 text-gray-800' },
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'Processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'Shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'Delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'Denied', label: 'Denied', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': Clock,
      'Confirmed': CheckCircle,
      'Processing': Package,
      'Shipped': Truck,
      'Delivered': CheckCircle,
      'Cancelled': XCircle,
      'Denied': XCircle
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-purple-100 text-purple-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Denied': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'SLR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = allOrders?.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusUpdate = async (order) => {
    setSelectedOrder(order);
    setOrderStatusData({
      status: order.orderStatus,
      message: order.adminResponse?.message || '',
      trackingNumber: order.trackingNumber || ''
    });
    setShowStatusModal(true);
  };

  const submitStatusUpdate = async () => {
    if (!orderStatusData.status) {
      toast.error('Please select a status');
      return;
    }

    dispatch(updateOrderStatus({
      orderId: selectedOrder._id,
      status: orderStatusData.status,
      message: orderStatusData.message,
      trackingNumber: orderStatusData.trackingNumber
    }));
  };

  const downloadReceipt = (order) => {
    // Simple receipt generation - in production, use proper PDF library
    const receiptContent = `
Order Receipt - SnapTech
========================

Order ID: ${order._id}
Date: ${formatDate(order.createdAt)}
Customer: ${order.user?.name}
Email: ${order.user?.email}

Items:
${order.orderItems.map(item => 
  `- ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
).join('\n')}

Subtotal: ${formatPrice(order.totalPrice - order.taxPrice - order.shippingPrice)}
Shipping: ${formatPrice(order.shippingPrice)}
Tax: ${formatPrice(order.taxPrice)}
Total: ${formatPrice(order.totalPrice)}

Status: ${order.orderStatus}
Payment: ${order.isPaid ? 'Paid' : 'Pending'}

Shipping Address:
${order.shippingAddress.fullName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
${order.shippingAddress.country}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${order._id.slice(-8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading && !allOrders) {
    return <Loader text="Loading orders..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600">
                  {filteredOrders.length} orders {statusFilter !== 'all' && `(${statusFilter})`}
                </p>
              </div>
            </div>

            <button
              onClick={() => dispatch(getAllOrders())}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders, customers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {orderStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Overview */}
            <div className="flex flex-wrap gap-2">
              {orderStatuses.slice(1).map(status => {
                const count = allOrders?.filter(order => order.orderStatus === status.value).length || 0;
                return (
                  <span
                    key={status.value}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
                  >
                    {status.label}: {count}
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.orderStatus);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <StatusIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order._id.slice(-8)}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-gray-600 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(order.totalPrice)}
                        </p>
                        <p className={`text-sm ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                          {order.isPaid ? 'Paid' : 'Payment Pending'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Customer</span>
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="font-medium text-gray-900">{order.user?.name}</p>
                          <p>{order.user?.email}</p>
                          <p>{order.shippingAddress.phone}</p>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Shipping Address</span>
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>

                      {/* Payment & Tracking */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Payment & Tracking</span>
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Method: {order.paymentMethod}</p>
                          <p>Status: {order.isPaid ? 'Paid' : 'Pending'}</p>
                          {order.trackingNumber && (
                            <p className="flex items-center space-x-1">
                              <Hash className="w-3 h-3" />
                              <span>Tracking: {order.trackingNumber}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <Package className="w-4 h-4" />
                        <span>Items ({order.orderItems.length})</span>
                      </h4>
                      <div className="space-y-3">
                        {order.orderItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=48&h=48&fit=crop&crop=center&auto=format&q=80`;
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-gray-600 text-sm">
                                Qty: {item.quantity} × {formatPrice(item.price)} = {formatPrice(item.quantity * item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Admin Response */}
                    {order.adminResponse && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>Admin Response</span>
                        </h4>
                        <p className="text-blue-800 text-sm">{order.adminResponse.message}</p>
                        <p className="text-blue-600 text-xs mt-1">
                          {formatDate(order.adminResponse.respondedAt)}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStatusUpdate(order)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Update Status</span>
                        </button>
                        
                        <button
                          onClick={() => downloadReceipt(order)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Receipt</span>
                        </button>
                      </div>

                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No matching orders' : 'No orders yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Orders will appear here once customers start placing them'
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Update Order Status
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={orderStatusData.status}
                    onChange={(e) => setOrderStatusData(prev => ({...prev, status: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {orderStatuses.slice(1).map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderStatusData.trackingNumber}
                    onChange={(e) => setOrderStatusData(prev => ({...prev, trackingNumber: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tracking number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Customer (Optional)
                  </label>
                  <textarea
                    value={orderStatusData.message}
                    onChange={(e) => setOrderStatusData(prev => ({...prev, message: e.target.value}))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a message for the customer..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitStatusUpdate}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageOrders;
