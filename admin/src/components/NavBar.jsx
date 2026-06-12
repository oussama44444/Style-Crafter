import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { 
  FiLogOut, FiUser, FiBell, FiSettings, FiChevronDown, 
  FiSun, FiMoon, FiMenu, FiX, FiShoppingBag, FiHome,
  FiPackage, FiUsers, FiBarChart2, FiList, FiFolder
} from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavBar = ({ setToken }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('theme');
    setToken('');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard': return 'Dashboard';
      case '/add': return 'Add Product';
      case '/list': return 'Products';
      case '/orders': return 'Orders';
      case '/set-model-image': return 'Model Images';
      case '/categories': return 'Categories';
      case '/profile': return 'Profile';
      case '/settings': return 'Settings';
      default: return 'Admin';
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiShoppingBag className="text-white text-lg sm:text-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  StyleCrafter
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </div>

            {/* Page Title (Desktop) */}
            <div className="hidden md:block">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                {getPageTitle()}
              </h2>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                    A
                  </div>
                  <FiChevronDown className={`text-gray-600 dark:text-gray-300 transition-transform duration-200 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} size={16} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-20 border border-gray-100 dark:border-gray-700">
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">admin@stylecrafter.com</p>
                      </div>
                      
                      <Link to="/profile" className="flex items-center gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setIsProfileOpen(false)}>
                        <FiUser size={14} /> Profile
                      </Link>
                      
                      <Link to="/settings" className="flex items-center gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setIsProfileOpen(false)}>
                        <FiSettings size={14} /> Settings
                      </Link>
                      
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      
                      <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <FiLogOut size={14} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 shadow-2xl lg:hidden overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FiShoppingBag className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 dark:text-white">StyleCrafter</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <nav className="space-y-1">
                {[
                  { to: "/dashboard", label: "Dashboard", icon: FiBarChart2 },
                  { to: "/add", label: "Add Product", icon: FiPackage },
                  { to: "/list", label: "Products", icon: FiList },
                  { to: "/orders", label: "Orders", icon: FiShoppingBag },
                  { to: "/categories", label: "Categories", icon: FiFolder },
                  { to: "/set-model-image", label: "Model Images", icon: FiImage },
                  { to: "/profile", label: "Profile", icon: FiUser },
                  { to: "/settings", label: "Settings", icon: FiSettings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={18} /> {item.label}
                    </Link>
                  );
                })}
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm">
                  <FiLogOut size={18} /> Logout
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;