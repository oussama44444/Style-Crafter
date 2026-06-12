import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, FiPhone, FiMail, FiFacebook, FiTwitter, 
  FiInstagram, FiYoutube, FiSend, FiHeart, FiArrowRight,
  FiHome, FiInfo, FiTruck, FiShield
} from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const companyLinks = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "About Us", path: "/about", icon: FiInfo },
    { name: "Delivery Info", path: "/delivery", icon: FiTruck },
    { name: "Privacy Policy", path: "/privacy", icon: FiShield }
  ];

  const socialLinks = [
    { icon: FiFacebook, url: "https://facebook.com", color: "hover:bg-[#1877f2]" },
    { icon: FiTwitter, url: "https://twitter.com", color: "hover:bg-[#1da1f2]" },
    { icon: FiInstagram, url: "https://instagram.com", color: "hover:bg-[#e4405f]" },
    { icon: FiYoutube, url: "https://youtube.com", color: "hover:bg-[#ff0000]" }
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={assets.logo} className="w-12 h-12 object-contain" alt="logo" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Style Crafter
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting style, creating confidence. Discover the perfect blend of comfort and elegance with our premium collection.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} group`}
                  >
                    <Icon className="text-gray-400 group-hover:text-white transition-colors" size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                    >
                      <Icon size={14} className="group-hover:translate-x-1 transition-transform" />
                      {link.name}
                      <FiArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 group">
                <FiPhone className="group-hover:text-purple-400 transition-colors" />
                <span>+216 21 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 group">
                <FiMail className="group-hover:text-purple-400 transition-colors" />
                <span>contact@stylecrafter.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 group">
                <FiMapPin className="group-hover:text-purple-400 transition-colors" />
                <span>Tunis, Tunisia</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Newsletter
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg hover:scale-105 transition-all duration-300"
              >
                <FiSend size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods & Features */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="PayPal" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Amex" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <FiHeart className="text-red-500 animate-pulse" size={14} /> by Style Crafter
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Style Crafter. All rights reserved. | Designed with passion for fashion
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
   

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </footer>
  );
}

export default Footer;