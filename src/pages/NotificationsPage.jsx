import React, { useState } from 'react';
import { Bell, Send, Users, MessageSquare, Mail, Smartphone, Plus } from 'lucide-react';

const NotificationCard = ({ notification }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${
          notification.type === 'push' ? 'bg-blue-100' :
          notification.type === 'sms' ? 'bg-green-100' : 'bg-purple-100'
        }`}>
          {notification.type === 'push' && <Bell className="h-5 w-5 text-blue-600" />}
          {notification.type === 'sms' && <Smartphone className="h-5 w-5 text-green-600" />}
          {notification.type === 'email' && <Mail className="h-5 w-5 text-purple-600" />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
          <p className="text-sm text-gray-600">{notification.audience}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        notification.status === 'sent' ? 'bg-green-100 text-green-800' :
        notification.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {notification.status}
      </span>
    </div>

    <p className="text-gray-700 mb-4">{notification.message}</p>

    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>Recipients: {notification.recipients}</span>
      <span>{notification.sentAt}</span>
    </div>
  </div>
);

function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('send');
  const [notificationType, setNotificationType] = useState('push');
  const [audience, setAudience] = useState('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'Payment Reminder',
      message: 'Your payment is due tomorrow. Please complete the payment to avoid any service interruption.',
      type: 'sms',
      audience: 'Users with pending payments',
      recipients: '1,234',
      status: 'sent',
      sentAt: '2 hours ago'
    },
    {
      id: 2,
      title: 'New Feature Alert',
      message: 'We have added new stock management features to help you track inventory better.',
      type: 'push',
      audience: 'All active users',
      recipients: '8,456',
      status: 'sent',
      sentAt: '1 day ago'
    },
    {
      id: 3,
      title: 'KYC Verification Required',
      message: 'Complete your KYC verification to unlock premium features and increase transaction limits.',
      type: 'email',
      audience: 'Unverified users',
      recipients: '892',
      status: 'scheduled',
      sentAt: 'Tomorrow 9:00 AM'
    }
  ];

  const handleSendNotification = () => {
    console.log('Sending notification:', { notificationType, audience, title, message });
    // Reset form
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Communication</h1>
          <p className="text-gray-600 mt-1">Send bulk notifications and manage communication with users</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'send'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Send Notification
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Notification History
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'templates'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Templates
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'send' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type
                  </label>
                  <select
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="push">Push Notification</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="inactive">Inactive Users</option>
                    <option value="corporate">Corporate Accounts</option>
                    <option value="individual">Individual Accounts</option>
                    <option value="pending-kyc">Pending KYC</option>
                    <option value="overdue">Overdue Payments</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notification title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your message..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {notificationType === 'sms' ? '160' : '500'} character limit
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  Save as Draft
                </button>
                <button 
                  onClick={handleSendNotification}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Message Templates</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Create Template</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Payment Reminder', category: 'Payment', usage: '45 times' },
                  { name: 'Welcome Message', category: 'Onboarding', usage: '892 times' },
                  { name: 'KYC Reminder', category: 'Verification', usage: '234 times' },
                  { name: 'Feature Update', category: 'Product', usage: '12 times' }
                ].map((template, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.category}</p>
                      </div>
                      <p className="text-sm text-gray-500">{template.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;