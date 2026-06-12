import React, { useState } from 'react';
import { FiGlobe, FiMail, FiBell, FiShield, FiDatabase, FiCloud, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      storeName: 'StyleCrafter',
      storeEmail: 'store@stylecrafter.com',
      storePhone: '+1 234 567 8900',
      currency: 'USD',
      timezone: 'America/New_York'
    },
    notifications: {
      emailNotifications: true,
      orderAlerts: true,
      inventoryAlerts: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    }
  });

  const handleToggle = (section, setting) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: !prev[section][setting]
      }
    }));
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving settings:', settings);
    // API call to save settings
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">System Settings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure your store settings and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <FiGlobe size={16} className="sm:w-5 sm:h-5" /> General Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settings.general.storeName}
                  onChange={(e) => handleChange('general', 'storeName', e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Store Email</label>
                <input
                  type="email"
                  value={settings.general.storeEmail}
                  onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Store Phone</label>
                <input
                  type="text"
                  value={settings.general.storePhone}
                  onChange={(e) => handleChange('general', 'storePhone', e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={settings.general.currency}
                  onChange={(e) => handleChange('general', 'currency', e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <FiBell size={16} className="sm:w-5 sm:h-5" /> Notification Settings
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 sm:py-2 gap-2 sm:gap-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {key === 'emailNotifications' && 'Receive email notifications'}
                      {key === 'orderAlerts' && 'Get alerts for new orders'}
                      {key === 'inventoryAlerts' && 'Low stock notifications'}
                      {key === 'marketingEmails' && 'Receive marketing emails'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('notifications', key)}
                    className="text-xl sm:text-2xl self-start sm:self-auto"
                  >
                    {value ? <FiToggleRight className="text-green-500" size={22} /> : <FiToggleLeft className="text-gray-400" size={22} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;