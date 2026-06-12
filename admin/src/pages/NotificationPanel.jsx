import React, { useState, useEffect } from 'react';
import { FiX, FiBell, FiShoppingBag, FiPackage, FiTruck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Simulated notifications - replace with actual API call
    const mockNotifications = [
      {
        id: 1,
        type: 'order',
        title: 'New Order Received',
        message: 'Order #ORD-1234 has been placed by John Doe',
        time: '5 minutes ago',
        read: false,
        icon: FiShoppingBag,
        color: 'text-blue-500'
      },
      {
        id: 2,
        type: 'shipping',
        title: 'Order Shipped',
        message: 'Order #ORD-1232 has been shipped',
        time: '1 hour ago',
        read: false,
        icon: FiTruck,
        color: 'text-purple-500'
      },
      {
        id: 3,
        type: 'delivery',
        title: 'Order Delivered',
        message: 'Order #ORD-1231 has been delivered successfully',
        time: '3 hours ago',
        read: true,
        icon: FiCheckCircle,
        color: 'text-green-500'
      },
      {
        id: 4,
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Product "Classic Denim Jacket" is running low on stock',
        time: '1 day ago',
        read: true,
        icon: FiAlertCircle,
        color: 'text-yellow-500'
      }
    ];
    setNotifications(mockNotifications);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-[calc(100vw-2rem)] sm:w-96 max-w-[calc(100vw-2rem)] sm:max-w-96 bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <FiBell className="text-white" size={18} />
          <h3 className="text-white font-semibold text-sm sm:text-base">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-white text-[10px] sm:text-xs hover:text-gray-300 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
            <FiX size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <FiBell className="mx-auto text-3xl sm:text-4xl mb-2" />
            <p className="text-sm sm:text-base">No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notif.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex gap-2.5 sm:gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className={`${notif.color} text-base sm:text-lg md:text-xl`} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                      {notif.title}
                    </p>
                    <p className="text-gray-600 text-[11px] sm:text-xs mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-1.5 sm:mt-2">
                      {notif.time}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-3 sm:px-4 py-2 text-center">
        <button className="text-blue-500 text-[11px] sm:text-sm hover:text-blue-600 transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;