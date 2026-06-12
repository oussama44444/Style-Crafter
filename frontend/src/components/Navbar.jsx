import { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";
import { 
  FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, 
  FiHome, FiGrid, FiInfo, FiMail, FiLogOut, 
  FiPackage, FiHeart, FiSettings, FiChevronRight,
  FiLogIn, FiUserPlus, FiList, FiTag
} from "react-icons/fi";
import { toast } from "react-toastify";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside menu
  useEffect(() => {
    if (!visible) return;
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  const SignOut = () => {
    navigate('/SignIn');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  // Handle cart navigation - only if there are items
  const handleCartNavigation = () => {
    const cartCount = getCartCount();
    if (cartCount > 0) {
      navigate('/cart');
    } else {
      toast.warning("Your cart is empty. Add some items first!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
      });
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: FiHome },
    { to: "/collection", label: "Collection", icon: FiGrid },
    { to: "/about", label: "About", icon: FiInfo },
    { to: "/contact", label: "Contact", icon: FiMail },
  ];

  const profileLinks = [
    { to: "/orders", label: "My Orders", icon: FiPackage },
    { to: "/profile", label: "Profile Settings", icon: FiUser },
    { to: "/wishlist", label: "Wishlist", icon: FiHeart },
  ];

  const cartCount = getCartCount();

  return (
    <div className="relative">
      {/* Main Navbar */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm py-4'
        }
      `}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="group relative overflow-hidden"
            >
              <p className={`
                relative text-3xl sm:text-4xl font-bold whitespace-nowrap transition-all duration-300
                ${scrolled 
                  ? 'text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text' 
                  : 'text-white'
                }
              `} style={{fontFamily: 'Dancing Script, cursive'}}>
                Style Crafter
              </p>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `
                    relative font-medium transition-all duration-300
                    ${scrolled ? 'text-gray-700' : 'text-gray-200'}
                    ${isActive 
                      ? (scrolled ? 'text-blue-600' : 'text-white') 
                      : 'hover:text-blue-400'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                className={`
                  p-2 rounded-full transition-all duration-300 hover:scale-110
                  ${scrolled 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-200 hover:bg-white/10'
                  }
                `}
              >
                <FiSearch size={20} />
              </button>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => token ? null : navigate('/SignIn')}
                  className={`
                    p-2 rounded-full transition-all duration-300 hover:scale-110
                    ${scrolled 
                      ? 'text-gray-600 hover:bg-gray-100' 
                      : 'text-gray-200 hover:bg-white/10'
                    }
                  `}
                >
                  <FiUser size={20} />
                </button>
                
                {token && (
                  <div className="absolute right-0 mt-3 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700">
                        <p className="text-white text-sm font-semibold">My Account</p>
                        <p className="text-gray-300 text-xs">Manage your profile</p>
                      </div>
                      <div className="py-2">
                        {profileLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <button
                              key={link.to}
                              onClick={() => {
                                navigate(link.to);
                                setVisible(false);
                              }}
                              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                              <Icon size={16} />
                              {link.label}
                            </button>
                          );
                        })}
                        <hr className="my-1" />
                        <button
                          onClick={SignOut}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                        >
                          <FiLogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button - Only navigates if items exist */}
              <div className="relative group">
                <button
                  onClick={handleCartNavigation}
                  className={`
                    p-2 rounded-full transition-all duration-300 hover:scale-110
                    ${scrolled 
                      ? 'text-gray-600 hover:bg-gray-100' 
                      : 'text-gray-200 hover:bg-white/10'
                    }
                    ${cartCount === 0 ? 'opacity-60' : ''}
                  `}
                  title={cartCount === 0 ? "Your cart is empty" : "View cart"}
                >
                  <FiShoppingCart size={20} />
                </button>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={burgerRef}
                onClick={() => setVisible(true)}
                className={`
                  md:hidden p-2 rounded-full transition-all duration-300
                  ${scrolled 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-200 hover:bg-white/10'
                  }
                `}
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden animate-fadeIn"
          onClick={() => setVisible(false)}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[101] transition-transform duration-300 ease-out md:hidden
          ${visible ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-xl font-bold">Menu</h2>
              <p className="text-gray-300 text-sm">Explore Style Crafter</p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-white hover:text-gray-300 transition-colors p-2"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="py-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setVisible(false)}
                className={({ isActive }) => `
                  flex items-center justify-between px-6 py-3 transition-all duration-300
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </div>
                <FiChevronRight size={16} className="text-gray-400" />
              </NavLink>
            );
          })}

          {/* Cart in Mobile Menu */}
          <div className="px-6 py-2">
            <button
              onClick={() => {
                handleCartNavigation();
                setVisible(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiShoppingCart size={20} className="text-gray-600" />
                <span className="font-medium text-gray-700">Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile Section in Mobile Menu (when logged in) */}
          {token && (
            <>
              <div className="px-6 pt-4 pb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
              </div>
              {profileLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setVisible(false)}
                    className={({ isActive }) => `
                      flex items-center justify-between px-6 py-3 transition-all duration-300
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <FiChevronRight size={16} className="text-gray-400" />
                  </NavLink>
                );
              })}
            </>
          )}
        </div>

        {/* Auth Section for Mobile */}
        {!token ? (
          <div className="border-t border-gray-200 pt-4 px-6 space-y-2">
            <button
              onClick={() => {
                navigate('/SignIn');
                setVisible(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              <FiLogIn size={18} />
              Sign In
            </button>
            <button
              onClick={() => {
                navigate('/register');
                setVisible(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium"
            >
              <FiUserPlus size={18} />
              Create Account
            </button>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4 px-6">
            <button
              onClick={SignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              <FiLogOut size={18} />
              Sign Out
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
          <p className="text-xs text-gray-400">© 2024 Style Crafter. All rights reserved.</p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Navbar;