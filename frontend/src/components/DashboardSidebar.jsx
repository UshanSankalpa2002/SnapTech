import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ChevronRight } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const DashboardSidebar = ({ activeTab, setActiveTab, tabs, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {user?.name}
          </h3>
          <p className="text-gray-600 text-sm">{user?.email}</p>
          {user?.role === 'admin' && (
            <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-medium rounded-full">
              Administrator
            </span>
          )}
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Dashboard Menu
          </h4>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white"
      >
        <h4 className="font-semibold mb-2">Account Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-green-100">Member since:</span>
            <span>{new Date(user?.createdAt).getFullYear()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-100">Account type:</span>
            <span className="capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-100">Status:</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>Active</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
        <p className="text-gray-600 text-sm mb-4">
          Contact our support team for any questions or assistance.
        </p>
        <a
          href="mailto:support@snaptech.com"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
        >
          Contact Support
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </motion.div>
    </div>
  );
};

export default DashboardSidebar;