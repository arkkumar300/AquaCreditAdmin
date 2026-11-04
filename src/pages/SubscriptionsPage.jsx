import React, { useState, useEffect } from 'react';
import { Crown, DollarSign, Users, Calendar, Plus, Search, Filter, Trash2, Edit, X, Check, Clock, User, UserPlus, Bell, AlertCircle } from 'lucide-react';
import axios from 'axios';
import ApiService from '../services/ApiService';
import moment from 'moment';

const SubscriptionCard = ({ subscription, onCancel, onRenew, onViewMembers, onNotify }) => {
  // Use status from backend if available, otherwise fallback to computed
  const status = subscription.status || (() => {
    if (subscription.is_cancelled) return 'cancelled';
    if (moment(subscription.end_date).isBefore(moment())) return 'expired';
    if (subscription.is_active) return 'active';
    return 'inactive';
  })();

  const getStatusColor = () => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            subscription.plan?.name?.toLowerCase().includes('premium') ? 'bg-purple-100' :
            subscription.plan?.name?.toLowerCase().includes('business') ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Crown className={`h-5 w-5 ${
              subscription.plan?.name?.toLowerCase().includes('premium') ? 'text-purple-600' :
              subscription.plan?.name?.toLowerCase().includes('business') ? 'text-blue-600' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {subscription.user?.name || subscription.user?.businessName || 'N/A'}
            </h3>
            <p className="text-sm text-gray-600">{subscription.user?.email || 'No email'}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Plan</p>
          <p className="font-semibold text-gray-900">{subscription.plan?.name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Price</p>
          <p className="font-semibold text-green-600">₹{subscription.total_price}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Users</p>
          <p className="font-medium text-gray-900">{subscription.purchased_user_count} users</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-medium text-gray-900">{subscription.plan?.duration_days} days</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Start Date</p>
          <p className="font-medium text-gray-900">{moment(subscription.start_date).format('DD MMM YYYY')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">End Date</p>
          <p className="font-medium text-gray-900">{moment(subscription.end_date).format('DD MMM YYYY')}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{subscription.memberCount || subscription.purchased_user_count} users</span>
        </div>
        <div className="flex items-center space-x-2">
          {status === 'active' && (
            <>
              <button
                onClick={() => onViewMembers(subscription.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
              >
                <UserPlus className="h-4 w-4" />
                <span>Members</span>
              </button>
              <button
                onClick={() => onCancel(subscription.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Cancel
              </button>
            </>
          )}
          {status === 'expired' && (
            <>
              <button
                onClick={() => onRenew(subscription.id)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Renew
              </button>
              <button
                onClick={() => onNotify(subscription)}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm flex items-center space-x-1"
              >
                <Bell className="h-4 w-4" />
                <span>Notify</span>
              </button>
            </>
          )}
          <button className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ plan, isPopular = false, onEdit, onDelete }) => {
  const [showFullFeatures, setShowFullFeatures] = useState(false);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 p-6 relative ${isPopular ? 'border-purple-500' : 'border-gray-200'}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="text-3xl font-bold text-gray-900 mb-1">₹{plan.price}</div>
        <p className="text-gray-600">for {plan.duration_days} days</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">Max Users:</span>
          </div>
          <span className="font-bold text-gray-900">{plan.NOU || 1}</span>
        </div>
      </div>

      {plan.description && (
        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
      )}

      <ul className="space-y-3 mb-6">
        {(showFullFeatures ? plan.points : plan.points?.slice(0, 4))?.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
        {plan.points?.length > 4 && (
          <button
            onClick={() => setShowFullFeatures(!showFullFeatures)}
            className="text-purple-600 text-sm hover:underline mt-2"
          >
            {showFullFeatures ? 'Show less' : `+${plan.points.length - 4} more features`}
          </button>
        )}
      </ul>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {plan.is_active ? 'Active' : 'Inactive'}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(plan)}
            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors text-sm flex items-center space-x-1 inline-flex"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(plan.id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm flex items-center space-x-1 inline-flex"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionMembersModal = ({ isOpen, onClose, subscriptionId, members, onAddMember, onRemoveMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5"/>
        </button>
        
        <h2 className="text-xl font-bold mb-4">Subscription Members</h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users to add..."
            className="w-full border px-3 py-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Current Members ({members.length})</h3>
          <div className="space-y-2">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <p className="font-medium">{member.user?.name}</p>
                  <p className="text-sm text-gray-600">{member.user?.email}</p>
                </div>
                <button
                  onClick={() => onRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: '',
    NOU: 1,
    points: [''],
    is_active: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        duration_days: initialData.duration_days || '',
        NOU: initialData.NOU || 1,
        points: initialData.points?.length ? initialData.points : [''],
        is_active: initialData.is_active ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        duration_days: '',
        NOU: 1,
        points: [''],
        is_active: true
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePointChange = (index, value) => {
    const newPoints = [...formData.points];
    newPoints[index] = value;
    setFormData(prev => ({ ...prev, points: newPoints }));
  };

  const addPoint = () => {
    setFormData(prev => ({ ...prev, points: [...prev.points, ''] }));
  };

  const removePoint = (index) => {
    setFormData(prev => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty points
    const cleanPoints = formData.points.filter(point => point.trim() !== '');
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      duration_days: parseInt(formData.duration_days),
      NOU: parseInt(formData.NOU),
      points: cleanPoints
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5"/>
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Plan' : 'Create New Plan'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</label>
              <input
                type="number"
                name="duration_days"
                required
                min="1"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.duration_days}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Users *</label>
            <input
              type="number"
              name="NOU"
              required
              min="1"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.NOU}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan Features</label>
            <div className="space-y-2">
              {formData.points.map((point, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`Feature ${index + 1}`}
                    value={point}
                    onChange={(e) => handlePointChange(index, e.target.value)}
                  />
                  {formData.points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePoint(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPoint}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Active Plan</label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors"
            >
              {initialData ? 'Update Plan' : 'Create Plan'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [membersModal, setMembersModal] = useState({ isOpen: false, subscriptionId: null, members: [] });
  const [notifyLoading, setNotifyLoading] = useState(false);

  const fetchSubscriptions = async () => {
    setLoadingSubs(true);
    try {
      const response = await ApiService.get('subscriptions/', {
        headers: { 'Content-Type': 'application/json' },
      });
      // The backend now returns { subscriptions: [...], pagination: {...} }
      const data = Array.isArray(response) ? response : response.subscriptions || [];
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoadingSubs(false);
    }
  };

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await ApiService.get('plans/', {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = Array.isArray(response) ? response : response.plans || [];
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchSubscriptionMembers = async (subscriptionId) => {
    try {
      const response = await ApiService.get(`/subscriptions/${subscriptionId}/members`);
      setMembersModal({
        isOpen: true,
        subscriptionId,
        members: Array.isArray(response) ? response : response.members || []
      });
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // ===== NEW: Handle Notify =====
  const handleNotify = async (subscription) => {
    if (!window.confirm(`Send a notification about expired subscription to ${subscription.user?.name || 'user'}?`)) return;
    setNotifyLoading(true);
    try {
      const payload = {
        user_id: subscription.user_id || subscription.user?.id,
        title: 'Subscription Expired',
        message: `Your subscription (${subscription.plan?.name || 'plan'}) has expired on ${moment(subscription.end_date).format('DD MMM YYYY')}. Please renew to continue enjoying the services.`,
        type: 'subscription_expired',
        is_push: true
      };
      await ApiService.post('notifications/', payload);
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setNotifyLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchPlans();
  }, []);

  const handleCreateOrEditPlan = async (planData) => {
    try {
      if (editingPlan) {
        await ApiService.put(`plans/${editingPlan.id}`, planData);
      } else {
        await ApiService.post('plans/', planData);
      }
      setIsModalOpen(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await ApiService.delete(`/plans/${id}`);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleCancelSubscription = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await ApiService.patch(`/subscriptions/${id}/cancel`, {
        cancellation_reason: 'Cancelled by admin'
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const handleRenewSubscription = async (id) => {
    try {
      await ApiService.post(`/subscriptions/${id}/renew`);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error renewing subscription:', error);
    }
  };

  const handleAddMember = async (subscriptionId, userId) => {
    try {
      await ApiService.post(`/subscriptions/${subscriptionId}/members`, { user_id: userId });
      fetchSubscriptionMembers(subscriptionId);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from subscription?')) return;
    try {
      await ApiService.delete(`/subscription-members/${memberId}`);
      setMembersModal(prev => ({
        ...prev,
        members: prev.members.filter(m => m.id !== memberId)
      }));
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  // Calculate statistics (using status from backend)
  const totalRevenue = subscriptions.reduce((acc, sub) => {
    if (sub.status === 'active') {
      return acc + parseFloat(sub.total_price || 0);
    }
    return acc;
  }, 0);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const expiredSubscriptions = subscriptions.filter(sub => sub.status === 'expired').length;

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = sub.status === statusFilter;
    }
    const matchesPlan = planFilter === 'all' || sub.plan?.name === planFilter;
  
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6">
      {/* Header, stats, tabs - unchanged */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-1">Manage subscription plans and user subscriptions</p>
        </div>
        <button
          onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalRevenue.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-blue-600">{activeSubscriptions}</p>
            </div>
            <Crown className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">{expiredSubscriptions}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'subscriptions'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'plans'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Plans
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'subscriptions' && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Search by name, email or plan..."
                    className="border pl-10 pr-3 py-2 rounded w-full"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="border px-3 py-2 rounded min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={planFilter}
                  onChange={e => setPlanFilter(e.target.value)}
                  className="border px-3 py-2 rounded min-w-[120px]"
                >
                  <option value="all">All Plans</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.name}>{plan.name}</option>
                  ))}
                </select>
              </div>

              {loadingSubs ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading subscriptions...</p>
                </div>
              ) : filteredSubscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No subscriptions found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredSubscriptions.map(sub => (
                    <SubscriptionCard
                      key={sub.id}
                      subscription={sub}
                      onCancel={handleCancelSubscription}
                      onRenew={handleRenewSubscription}
                      onViewMembers={fetchSubscriptionMembers}
                      onNotify={handleNotify}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'plans' && (
            // Plans tab remains unchanged
            <>
              {loadingPlans ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading plans...</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No plans found. Create your first plan!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans.map((plan, index) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      isPopular={index === 1}
                      onEdit={(plan) => { setEditingPlan(plan); setIsModalOpen(true); }}
                      onDelete={handleDeletePlan}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrEditPlan}
        initialData={editingPlan}
      />

      <SubscriptionMembersModal
        isOpen={membersModal.isOpen}
        onClose={() => setMembersModal({ isOpen: false, subscriptionId: null, members: [] })}
        subscriptionId={membersModal.subscriptionId}
        members={membersModal.members}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
}

export default SubscriptionsPage;