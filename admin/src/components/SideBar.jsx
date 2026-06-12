import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { 
  FiPlus, FiList, FiShoppingBag, FiImage, FiFolder, 
  FiHome, FiBarChart2, FiUsers, FiSettings, FiLogOut 
} from 'react-icons/fi';

const SideBar = () => {
  const location = useLocation();

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

  return (
    <div className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen shadow-2xl relative">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <FiShoppingBag className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">StyleCrafter</h1>
            <p className="text-gray-400 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="px-4 py-6">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-4 px-3">
          Main Menu
        </p>
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <NavLink
                key={index}
                to={item.to}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300 ease-in-out overflow-hidden
                  ${active 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
                
                {/* Icon */}
                <Icon className={`text-xl ${active ? 'text-white' : item.color} transition-transform duration-200 group-hover:scale-110`} />
                
                {/* Label */}
                <span className="font-medium">{item.label}</span>
                
                {/* Badge for Orders */}
                {item.to === "/orders" && !active && (
                  <span className="ml-auto bg-black-500 text-white text-xs px-2 py-1 rounded-full">
                  
                  </span>
                )}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

      {/* Bottom Navigation */}
      <div className="px-4 py-6">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-4 px-3">
          Account
        </p>
        <div className="flex flex-col gap-2">
          {bottomNavItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <NavLink
                key={index}
                to={item.to}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300 ease-in-out
                  ${active 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                <Icon className={`text-xl ${active ? 'text-white' : item.color}`} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 mt-4"
          >
            <FiLogOut className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
        <p className="text-gray-500 text-xs">
          © 2024 StyleCrafter
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default SideBar;