import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTruck, FiCreditCard, FiShield, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getTotalPrice, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (products.length > 0) {
      const updatedCartData = Object.keys(cartItems).flatMap(itemId => 
        Object.entries(cartItems[itemId])
          .filter(([size, quantity]) => quantity > 0)
          .map(([size, quantity]) => ({ _id: itemId, size, quantity }))
      );
      setCartData(updatedCartData);
    }
  }, [cartItems, products]);

  const productTotal = getTotalPrice();
  const deliveryFee = productTotal > 0 ? 10 : 0;
  const discountAmount = (productTotal * discount) / 100;
  const total = productTotal + deliveryFee - discountAmount;

  const handleQuantityChange = (itemId, size, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, size, newQuantity);
  };

  const handleRemoveItem = (itemId, size) => {
    updateQuantity(itemId, size, 0);
    toast.success("Item removed from cart", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(10);
      toast.success("Promo code applied! 10% discount", {
        position: "top-right",
        autoClose: 2000,
      });
    } else if (promoCode.toLowerCase() === "save20") {
      setDiscount(20);
      toast.success("Promo code applied! 20% discount", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error("Invalid promo code", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (cartData.length === 0) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-32">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
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
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Title text1="My" text2="Cart" />
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-500 mt-4">{cartData.length} item(s) in your cart</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:flex-[2] space-y-4">
            {cartData.map((item, index) => {
              const productData = products.find(product => product._id === item._id);
              if (!productData) return null;

              const totalPrice = productData.price * item.quantity;

              return (
                <div
                  key={`${item._id}-${item.size}-${index}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Product Image */}
                    <div className="sm:w-32">
                      <div className="relative overflow-hidden rounded-xl bg-gray-100">
                        <img
                          className="w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
                          src={productData.image[0]}
                          alt={productData.name || "Product image"}
                        />
                        {productData.bestseller && (
                          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">
                            ⭐ Bestseller
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{productData.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          Size: <span className="font-medium text-gray-700">{item.size}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          Price: <span className="font-medium text-gray-700">{currency}{productData.price}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          {currency}{totalPrice}
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item._id, item.size)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg self-start"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiShoppingBag /> Order Summary
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{currency}{productTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'Free' : `${currency}${deliveryFee}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-{currency}{discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>{currency}{total}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Try: SAVE10 or SAVE20</p>
              </div>

              {/* Delivery Info */}
              <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiTruck className="text-purple-500" />
                  <span>Free delivery on orders over {currency}100</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCreditCard className="text-purple-500" />
                  <span>Secure payment with multiple options</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiShield className="text-purple-500" />
                  <span>30-day return policy</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/place-order')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                Proceed to Checkout <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;