import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { 
  FiPackage, FiUser, FiMapPin, FiPhone, FiCalendar, 
  FiCreditCard, FiTruck, FiCheckCircle, FiClock, 
  FiXCircle, FiSearch, FiFilter, FiDownload 
} from 'react-icons/fi';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(`Order status updated to ${event.target.value}`);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: 'Cancelled' },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    let filtered = [...orders];
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.address.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiClock className="inline mr-1" size={12} />;
      case 'Processing': return <FiPackage className="inline mr-1" size={12} />;
      case 'Shipped': return <FiTruck className="inline mr-1" size={12} />;
      case 'Delivered': return <FiCheckCircle className="inline mr-1" size={12} />;
      case 'Cancelled': return <FiXCircle className="inline mr-1" size={12} />;
      default: return <FiPackage className="inline mr-1" size={12} />;
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.amount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">Track and manage customer orders</p>
        </div>

        {/* Stats Dashboard - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-xl md:text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-xl md:text-2xl font-bold text-blue-600">{stats.processing}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Processing</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-xl md:text-2xl font-bold text-purple-600">{stats.shipped}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Shipped</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-xl md:text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Delivered</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 text-center">
            <div className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">{currency}{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Revenue</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by customer or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div className="w-full sm:w-48 md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-10 md:p-12 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📦</div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">No Orders Found</h3>
            <p className="text-xs sm:text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header - Responsive */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <FiPackage className="text-white text-base sm:text-lg md:text-xl" />
                    <div>
                      <p className="text-white text-xs sm:text-sm font-medium">Order #{order._id.slice(-8)}</p>
                      <p className="text-gray-300 text-[10px] sm:text-xs flex items-center gap-1">
                        <FiCalendar size={10} className="sm:w-3 sm:h-3" />
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-0.5 sm:gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Order Content - Responsive Grid */}
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {/* Customer Info */}
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                        <FiUser size={14} /> Customer
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                        <FiPhone size={12} className="sm:w-3 sm:h-3" />
                        {order.address.phone}
                      </p>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                        <FiMapPin size={14} /> Address
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{order.address.street}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {order.address.city}, {order.address.state} {order.address.zipcode}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">{order.address.country}</p>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                        <FiCreditCard size={14} /> Summary
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">Items: {order.items.length}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Payment: {order.paymentMethod}</p>
                      <div className="text-base sm:text-lg md:text-2xl font-bold text-gray-800">
                        {currency}{order.amount}
                      </div>
                    </div>
                  </div>

                  {/* Order Items - Scroll on mobile */}
                  <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-sm">Items</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-32 sm:max-h-40 overflow-y-auto">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-2 sm:p-3 flex justify-between items-center">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{item.name}</p>
                            <p className="text-gray-500 text-[10px] sm:text-xs">
                              Size: {item.size} | Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-800 text-xs sm:text-sm ml-2">
                            {currency}{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons - Responsive */}
                  <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200 flex flex-wrap gap-2 sm:gap-3 justify-end">
                    <select
                      value={order.status}
                      onChange={e => statusHandler(e, order._id)}
                      className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 bg-white"
                      disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <FiXCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;