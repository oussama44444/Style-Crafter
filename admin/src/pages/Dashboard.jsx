import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { 
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign, 
  FiTrendingUp, FiArrowUp, FiArrowDown, FiCalendar,
  FiEye, FiShoppingCart, FiHeart, FiStar
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      // Fetch products
      const productsRes = await axios.get(`${backendUrl}/api/product/list`);
      // Fetch orders
      const ordersRes = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      
      const products = productsRes.data.products || [];
      const orders = ordersRes.data.orders || [];
      
      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'Pending').length;
      const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
      const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
      const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: 1248, // Replace with actual API call
        totalRevenue: totalRevenue,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders
      });
      
      setRecentOrders(orders.slice(0, 5));
      
      // Sample sales data (replace with actual API)
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <Icon size={24} />
                </div>
                <span className={`text-sm font-semibold ${stat.changeType === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                  {stat.changeType === 'up' ? <FiArrowUp /> : <FiArrowDown />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">{currency}{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-blue-500 hover:text-blue-600 text-sm">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">#{order._id.slice(-8)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.address?.firstName} {order.address?.lastName}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{currency}{order.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;