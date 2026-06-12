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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure your store settings and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiGlobe /> General Settings
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settings.general.storeName}
                  onChange={(e) => handleChange('general', 'storeName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                <input
                  type="email"
                  value={settings.general.storeEmail}
                  onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone</label>
                <input
                  type="text"
                  value={settings.general.storePhone}
                  onChange={(e) => handleChange('general', 'storePhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={settings.general.currency}
                  onChange={(e) => handleChange('general', 'currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBell /> Notification Settings
            </h2>
            <div className="space-y-3">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-500">
                      {key === 'emailNotifications' && 'Receive email notifications'}
                      {key === 'orderAlerts' && 'Get alerts for new orders'}
                      {key === 'inventoryAlerts' && 'Low stock notifications'}
                      {key === 'marketingEmails' && 'Receive marketing emails'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('notifications', key)}
                    className="text-2xl"
                  >
                    {value ? <FiToggleRight className="text-green-500" size={28} /> : <FiToggleLeft className="text-gray-400" size={28} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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