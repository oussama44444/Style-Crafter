import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/Shopcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { 
  FiUser, FiMail, FiMapPin, FiPhone, FiHome, 
  FiTruck, FiCreditCard, FiShield, FiCheckCircle, FiArrowRight,
  FiPackage
} from "react-icons/fi";

const Placeorder = () => {
  const [method, setMethod] = useState("pua");
  const { navigate, token, cartItems, setCartItems, getTotalPrice, products, currency, backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
  });

  useEffect(() => {
    // Build order items when component mounts or cart changes
    const items = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          const product = products.find(p => p._id === itemId);
          if (product) {
            items.push({
              name: product.name,
              price: product.price,
              quantity: cartItems[itemId][size],
              size: size,
              image: product.image
            });
          }
        }
      }
    }
    setOrderItems(items);
  }, [cartItems, products]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const productTotal = getTotalPrice();
  const deliveryFee = productTotal > 100 ? 0 : 10;
  const total = productTotal + deliveryFee;

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please login to place order");
      navigate('/SignIn');
      return;
    }

    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.state || 
        !formData.zipcode || !formData.phone) {
      toast.error("Please fill in all delivery information");
      return;
    }

    setLoading(true);

    try {
      const address = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        phone: formData.phone,
        country: "Tunisia"
      };

      // Do NOT include userId - backend will get it from token
      const orderData = {
        items: orderItems,
        amount: total,
        address: address,
      };

      console.log("Sending order data:", orderData);

      let endpoint = '';
      switch (method) {
        case 'pua':
          endpoint = `${backendUrl}/api/order/place`;
          break;
        case 'visa':
          endpoint = `${backendUrl}/api/order/visa`;
          break;
        case 'd17':
          endpoint = `${backendUrl}/api/order/D17`;
          break;
        default:
          endpoint = `${backendUrl}/api/order/place`;
      }

      const response = await axios.post(endpoint, orderData, { 
        headers: { token } 
      });

      if (response?.data?.success) {
        setCartItems({});
        toast.success("Order placed successfully!");
        setTimeout(() => navigate('/orders'), 2000);
      } else {
        toast.error(response?.data?.message || 'An error occurred');
      }
    } catch (error) {
      console.log("Order error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (orderItems.length === 0 && !loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-32">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Add some items before checking out</p>
          <button 
            onClick={() => navigate('/collection')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 inline-flex items-center gap-2"
          >
            Start Shopping <FiArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Title text1="Checkout" text2="Information" />
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-500 mt-4">Complete your order details below</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Delivery Form */}
          <div className="lg:flex-[1.5]">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiTruck className="text-purple-500" /> Delivery Information
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FiUser size={14} /> First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FiUser size={14} /> Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiMail size={14} /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiHome size={14} /> Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="123 Main St"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zipcode"
                      placeholder="Zip Code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiPhone size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+216 XX XXX XXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiPackage className="text-purple-500" /> Order Items ({orderItems.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <img src={item.image?.[0]} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>Size: {item.size}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>{currency}{item.price}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">{currency}{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({orderItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                  <span>{currency}{productTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">Delivery Fee {productTotal > 100 && <span className="text-xs text-green-500">(Free)</span>}</span>
                  <span>{deliveryFee === 0 ? 'Free' : `${currency}${deliveryFee}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>{currency}{total}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiCreditCard /> Payment Method
                </h4>
                <div className="space-y-3">
                  {[
                    { id: 'd17', name: 'D17', description: 'Pay with D17' },
                    { id: 'visa', name: 'Visa', description: 'Credit / Debit Card' },
                    { id: 'pua', name: 'Cash on Delivery', description: 'Pay when you receive' }
                  ].map(payment => (
                    <div
                      key={payment.id}
                      onClick={() => setMethod(payment.id)}
                      className={`flex items-center gap-4 p-3 border rounded-xl cursor-pointer transition-all duration-200 ${
                        method === payment.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        method === payment.id ? 'border-purple-500' : 'border-gray-400'
                      }`}>
                        {method === payment.id && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{payment.name}</p>
                        <p className="text-xs text-gray-500">{payment.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={onSubmitHandler}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Order <FiCheckCircle />
                  </>
                )}
              </button>

              {/* Security Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                  <FiShield size={12} /> Secure payment processed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Placeorder;