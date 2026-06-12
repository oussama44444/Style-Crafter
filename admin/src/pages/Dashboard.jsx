import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { 
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign, 
  FiTrendingUp, FiArrowUp, FiArrowDown, FiCalendar,
  FiEye, FiShoppingCart, FiHeart, FiStar
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const productsRes = await axios.get(`${backendUrl}/api/product/list`);
      const ordersRes = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      
      const products = productsRes.data.products || [];
      const orders = ordersRes.data.orders || [];
      
      const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'Pending').length;
      const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
      const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
      const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: 1248,
        totalRevenue: totalRevenue,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders
      });
      
      setRecentOrders(orders.slice(0, 5));
      
      setSalesData([
        { name: 'Jan', sales: 4000, revenue: 2400 },
        { name: 'Feb', sales: 3000, revenue: 1398 },
        { name: 'Mar', sales: 5000, revenue: 9800 },
        { name: 'Apr', sales: 2780, revenue: 3908 },
        { name: 'May', sales: 1890, revenue: 4800 },
        { name: 'Jun', sales: 2390, revenue: 3800 },
      ]);
      
      setTopProducts([
        { name: 'Classic Denim Jacket', sales: 234, revenue: 4678 },
        { name: 'Cotton T-Shirt', sales: 189, revenue: 2835 },
        { name: 'Summer Dress', sales: 156, revenue: 3120 },
        { name: 'Leather Boots', sales: 98, revenue: 2940 },
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'bg-blue-500', change: '+12%', changeType: 'up' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-green-500', change: '+8%', changeType: 'up' },
    { title: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-purple-500', change: '+5%', changeType: 'up' },
    { title: 'Total Revenue', value: `${currency}${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'bg-orange-500', change: '+15%', changeType: 'up' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className={`${stat.color} p-2 sm:p-3 rounded-xl text-white`}>
                    <Icon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${stat.changeType === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center gap-0.5 sm:gap-1`}>
                    {stat.changeType === 'up' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Sales Chart */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Sales Overview</h2>
              <select className="border rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="w-full h-[250px] sm:h-[280px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                    formatter={(value) => [`${currency}${value}`, 'Amount']}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Top Selling Products</h2>
            <div className="space-y-3 sm:space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} units sold</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800 text-xs sm:text-sm flex-shrink-0 ml-2">{currency}{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm">View All</button>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Customer</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 whitespace-nowrap">#{order._id.slice(-8)}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                        {order.address?.firstName} {order.address?.lastName}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {currency}{order.amount}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold inline-block ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;