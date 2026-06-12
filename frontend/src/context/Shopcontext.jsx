import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(''); // Add userId state
  const [completedOrders, setCompletedOrders] = useState([]);
  const [discount, setDiscount] = useState(0); 
  const [subscribedEmails, setSubscribedEmails] = useState([]); 

  const currency = 'dt';
  const navigate = useNavigate();
  const backendUrl = "http://localhost:6009";

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Please select a size before adding to cart!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    }

    const updatedCart = { ...cartItems };

    if (updatedCart[itemId]) {
      updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
    } else {
      updatedCart[itemId] = { [size]: 1 };
    }

    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, item) => {
      return total + Object.values(item).reduce((itemTotal, quantity) => itemTotal + quantity, 0);
    }, 0);
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const updatedCart = { ...cartItems };
    updatedCart[itemId][size] = quantity;

    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const applyDiscount = (email) => {
    if (!subscribedEmails.includes(email)) {
      setSubscribedEmails((prev) => [...prev, email]);
      setDiscount(30);  
      return { success: true, discount: 30 };
    } else {
      return { success: false, message: 'Email already subscribed!' };
    }
  };

  const getTotalPrice = () => {
    return Object.entries(cartItems).reduce((totalAmount, [itemId, sizes]) => {
      const product = products.find(product => product._id === itemId);
      if (product) {
        const price = discount > 0 ? product.price * (1 - discount / 100) : product.price;
        totalAmount += Object.entries(sizes).reduce((amount, [size, quantity]) => {
          return amount + (price * quantity);
        }, 0);
      }
      return totalAmount;
    }, 0);
  };

  const getDiscountedPrice = (product) => {
    return discount > 0 ? product.price * (1 - discount / 100) : product.price;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: userToken } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Get user info from token
  const getUserInfo = async (userToken) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, { 
        headers: { token: userToken } 
      });
      if (response.data.success) {
        setUserId(response.data.user._id);
        localStorage.setItem('userId', response.data.user._id);
        return response.data.user._id;
      }
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      getUserCart(storedToken);
      getUserInfo(storedToken); // Get user info when token is loaded
    }
  }, []);

  // Also check for userId in localStorage on initial load
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const contextValue = {
    products,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getTotalPrice,
    navigate,
    completedOrders,
    setCompletedOrders,
    token,
    setToken,
    userId,        // Add userId to context
    setUserId,     // Add setUserId to context
    cartItems,
    setCartItems,
    getDiscountedPrice,
    applyDiscount,
    backendUrl,    // Also add backendUrl for convenience
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;