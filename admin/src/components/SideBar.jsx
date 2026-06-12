import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { 
  FiPlus, FiList, FiShoppingBag, FiImage, FiFolder, 
  FiHome, FiBarChart2, FiUsers, FiSettings, FiLogOut,
  FiMenu, FiX
} from 'react-icons/fi';

const SideBar = ({ setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: FiBarChart2, color: "text-purple-500" },
    { to: "/add", label: "Add Product", icon: FiPlus, color: "text-green-500" },
    { to: "/list", label: "Products List", icon: FiList, color: "text-blue-500" },
    { to: "/orders", label: "Orders", icon: FiShoppingBag, color: "text-orange-500" },
    { to: "/set-model-image", label: "Model Images", icon: FiImage, color: "text-pink-500" },
    { to: "/categories", label: "Categories", icon: FiFolder, color: "text-yellow-500" },
  ];

  const bottomNavItems = [
    { to: "/profile", label: "Profile", icon: FiUsers, color: "text-gray-500" },
    { to: "/settings", label: "Settings", icon: FiSettings, color: "text-gray-500" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      setToken('');
      navigate('/login');
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <FiShoppingBag className="text-white text-base sm:text-xl" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base sm:text-xl">StyleCrafter</h1>
            <p className="text-gray-400 text-[10px] sm:text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4 px-2 sm:px-3">
          Main Menu
        </p>
        <div className="flex flex-col gap-1 sm:gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <NavLink
                key={index}
                to={item.to}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`
                  group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                  transition-all duration-300 ease-in-out overflow-hidden
                  ${active 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 sm:h-8 bg-white rounded-r-full"></div>
                )}
                
                <Icon className={`text-base sm:text-xl ${active ? 'text-white' : item.color} transition-transform duration-200 group-hover:scale-110`} />
                
                <span className="font-medium text-xs sm:text-sm">{item.label}</span>
                
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 sm:mx-4 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

      {/* Bottom Navigation */}
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4 px-2 sm:px-3">
          Account
        </p>
        <div className="flex flex-col gap-1 sm:gap-2">
          {bottomNavItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <NavLink
                key={index}
                to={item.to}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`
                  flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                  transition-all duration-300 ease-in-out
                  ${active 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                <Icon className={`text-base sm:text-xl ${active ? 'text-white' : item.color}`} />
                <span className="font-medium text-xs sm:text-sm">{item.label}</span>
              </NavLink>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 mt-2 sm:mt-4"
          >
            <FiLogOut className="text-base sm:text-xl" />
            <span className="font-medium text-xs sm:text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-center">
        <p className="text-gray-500 text-[10px] sm:text-xs">
          © 2024 StyleCrafter
        </p>
        <p className="text-gray-600 text-[8px] sm:text-xs mt-0.5 sm:mt-1">
          Version 1.0.0
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white shadow-lg"
      >
        {isMobileSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:block w-64 xl:w-72 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen shadow-2xl relative">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 z-50 shadow-2xl lg:hidden overflow-y-auto animate-slideInLeft">
            <SidebarContent />
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SideBar;