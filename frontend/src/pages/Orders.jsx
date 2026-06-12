import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import axios from "axios";
import { FiPackage, FiCalendar, FiCreditCard, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiEye } from "react-icons/fi";

const Orders = () => {
  const { token, currency, backendUrl } = useContext(ShopContext); 
  const [orderData, setOrderData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }
      
      console.log("Loading orders...");
      setLoading(true);
      
      // Empty body - userId will come from token via auth middleware
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`, 
        {},
        { headers: { token } }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        let allOrdersItem = [];
        
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const orderItem = {
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
              address: order.address
            };
            allOrdersItem.push(orderItem);
          });
        });
        
        setOrderData(allOrdersItem.reverse());
        console.log("Orders set:", allOrdersItem.length);
      } else {
        console.log("Response not successful:", response.data.message);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'Shipped': return 'bg-purple-500';
      case 'Processing': return 'bg-blue-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <FiCheckCircle className="text-green-500" />;
      case 'Shipped': return <FiTruck className="text-purple-500" />;
      case 'Processing': return <FiPackage className="text-blue-500" />;
      case 'Pending': return <FiClock className="text-yellow-500" />;
      default: return <FiPackage className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-36 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title text1={"My"} text2={"Orders"} />
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-500 mt-4">Track and manage your orders</p>
        </div>

        {orderData.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <button 
              onClick={() => window.location.href = '/collection'}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orderData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex flex-wrap justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FiPackage className="text-white text-xl" />
                    <div>
                      <p className="text-white text-sm">Order #{item.orderId?.slice(-8) || 'N/A'}</p>
                      <p className="text-gray-300 text-xs flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(item.date).toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-white text-sm font-medium">{item.status}</span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="md:w-32">
                      <img 
                        className="w-32 h-32 object-cover rounded-xl shadow-md" 
                        src={item.image?.[0] || '/placeholder.jpg'} 
                        alt={item.name} 
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Quantity:</span>
                          <span className="font-medium text-gray-700">{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Size:</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-md text-sm font-medium">{item.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Price:</span>
                          <span className="font-semibold text-gray-800">{currency}{item.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="text-gray-400" />
                          <span className="text-gray-600">Payment: {item.paymentMethod}</span>
                        </div>
                        {item.address && (
                          <div className="flex items-center gap-2">
                            <FiMapPin className="text-gray-400" />
                            <span className="text-gray-600">
                              {item.address.street}, {item.address.city}, {item.address.country}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="md:w-48 flex flex-col gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                        <span className="text-sm text-gray-600">{item.status}</span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === index ? null : index)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                      >
                        <FiEye size={16} />
                        Track Order
                      </button>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {selectedOrder === index && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-3">Order Details</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p><span className="text-gray-500">Order ID:</span> {item.orderId}</p>
                          <p><span className="text-gray-500">Order Date:</span> {new Date(item.date).toLocaleString()}</p>
                          <p><span className="text-gray-500">Payment Status:</span> {item.payment ? 'Paid' : 'Pending'}</p>
                        </div>
                        {item.address && (
                          <div className="space-y-2">
                            <p><span className="text-gray-500">Shipping Address:</span></p>
                            <p className="text-gray-700">
                              {item.address.firstName} {item.address.lastName}<br />
                              {item.address.street}<br />
                              {item.address.city}, {item.address.state} {item.address.zipcode}<br />
                              {item.address.country}<br />
                              Phone: {item.address.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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