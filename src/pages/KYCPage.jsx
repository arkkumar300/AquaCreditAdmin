import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileCheck, Clock, CheckCircle, XCircle, Eye, Download, Filter, Search } from 'lucide-react';
import ApiService from '../services/ApiService';

const UserCard = ({ user, onApprove, onReject, onView }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.mobile}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          user.status === 'active' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
        }`}>
        {user.is_verified ? 'Verified' : "Pending"}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-600">Current Balance</p>
        <p className="font-medium text-gray-900">{user.current_balance}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Total Credit Given</p>
        <p className="font-medium text-gray-900">{user.total_credit_given}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Total Payment Got</p>
        <p className="font-medium text-gray-900">{user.total_payment_got}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Created At</p>
        <p className="font-medium text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <button
        onClick={() => onView(user)}
        className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Eye className="h-4 w-4" />
        <span>View Details</span>
      </button>

      <div className="flex items-center space-x-2">
        {!user.is_verified && (
          <>
          {/* // ✅ User is active + verified → Show Reject Button */}
          <button
            onClick={() => onReject(user)}
            className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject</span>
          </button>
       
          {/* // ❌ User not verified or not active → Show Approve Button */}
          <button
            onClick={() => onApprove(user)}
            className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Approve</span>
          </button>
          </>
        )}
      </div>
    </div>
  </div>
);

function KYCPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await ApiService.get("user/", null, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("rrr::", response)
        // API gives { users: [...] }
        const usersWithStatus = response.users.map(user => ({
          ...user,
          status: user.status ?? "pending", // fallback if not available
        }));

        setUsers(usersWithStatus);

      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users.");
      }
    };

    fetchUsers();
  }, [isRefresh]);
  const handleApprove = async (user) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found.");
        return;
      }

      await ApiService.put(
        `/user/${user.id}`,
        { is_verified: true, is_active: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, status: "active" } : u))
      );

    } catch (error) {
      console.error("Error approving user:", error);
      setError("Failed to approve user.");
    }finally{
      setIsRefresh(!isRefresh)
    }
  };

  const handleReject = async (user) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found.");
        return;
      }

      await ApiService.put(
        `/user/${user.id}`,
        { is_verified: false, is_active: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, status: "inactive" } : u))
      );

    } catch (error) {
      console.error("Error rejecting user:", error);
      setError("Failed to reject user.");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getActiveStatusCount = () =>
    users.filter(user => user.is_active === true).length;

  const getInActiveStatusCount = () =>
    users.filter(user => user.is_active === false).length;

  const getVerifiedCount = () =>
    users.filter(user => user.is_verified === true).length;

  const DetailsModal = () => {
    if (!showDetails || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto m-4">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">✕</button>
          </div>
          <div className="p-6 space-y-4">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
            <p><strong>Current Balance:</strong> {selectedUser.current_balance}</p>
            <p><strong>Total Credit Given:</strong> {selectedUser.total_credit_given}</p>
            <p><strong>Total Payment Got:</strong> {selectedUser.total_payment_got}</p>
            <p><strong>Created At:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Verification</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{getActiveStatusCount()}</p>
          <Clock className="h-8 w-8 text-yellow-500" />
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{getInActiveStatusCount()}</p>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Verfiy</p>
          <p className="text-2xl font-bold text-red-600">{getVerifiedCount('inactive')}</p>
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <FileCheck className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onView={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <DetailsModal />
    </div>
  );
}

export default KYCPage;
