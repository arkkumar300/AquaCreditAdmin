// settings
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, CreditCard, Smartphone, Mail, Globe, Save, Eye, EyeOff, User, Lock } from 'lucide-react';
import ApiService from '../services/ApiService';

const SettingCard = ({ title, description, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-[98%]">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
    {children}
  </div>
);

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('user-details');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // User Details State
  const [companyName, setCompanyName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [usersData, setUsersData] = useState(null);

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const rrr = JSON.parse(userData);
      setUsersData(rrr);
      setCompanyName(rrr.name || '');
      setMobile(rrr.mobile || '');
      setSupportEmail(rrr.email || '');
    }
  }, []);

  // Update User Details
  const saveAdmin = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }
      const payload = {
        name: companyName,
        email: supportEmail,
        mobile: mobile,
      };
      const response = await ApiService.put(`admin/${usersData.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.user) {
        localStorage.setItem("userData", JSON.stringify(response.user));
        setUsersData(response.user);
        alert("User details updated successfully!");
      } else {
        alert(response || "Failed to update user data.");
      }
    } catch (err) {
      console.error("Update User Error:", err);
      alert(err.response?.data?.message || "Server error while updating user data.");
    }
  };

  // Update Password
  const updatePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      const response = await ApiService.put(
        `admin/${usersData.id}/password`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.success) {
        setPasswordSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(response?.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error("Password Update Error:", err);
      setPasswordError(err.response?.data?.message || 'Server error while updating password.');
    }
  };

  const tabItems = [
    { id: 'user-details', name: 'User Details', icon: User },
    { id: 'password', name: 'Password Settings', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings & Configurations</h1>
          <p className="text-gray-600 mt-1">Manage platform settings and configurations</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'user-details' && (
            <>
              <SettingCard
                title="User Details"
                description="Update your personal and company information"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </SettingCard>

              {/* Save Button for User Details */}
              <div className="flex justify-end">
                <button
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={saveAdmin}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'password' && (
            <>
              <SettingCard
                title="Change Password"
                description="Update your account password"
              >
                <div className="space-y-4">
                  {/* Old Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Old Password
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter old password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter new password (min 6 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error / Success Messages */}
                  {passwordError && (
                    <div className="text-red-600 text-sm">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="text-green-600 text-sm">{passwordSuccess}</div>
                  )}
                </div>
              </SettingCard>

              {/* Save Button for Password */}
              <div className="flex justify-end">
                <button
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={updatePassword}
                >
                  <Save className="h-4 w-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;