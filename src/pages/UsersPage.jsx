import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, MoreVertical, Eye, Edit, Trash2, UserPlus, Download, Building2, User, Phone, Mail, MapPin, Calendar, Activity
} from 'lucide-react';
import ApiService from '../services/ApiService';
import CustomerCard from '../components/CustomerCard';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import CreateCustomerModal from '../components/CreateCustomerModal';

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [usersData, setUsersData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [usersTotalCount, setUsersTotalCount] = useState([]);
  const [last30DaysCount, setlLast30DaysCount] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [supplier, setSupplier] = useState([]);
  const [customer, setCustomer] = useState([]);

  // Inside the component, add state for modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };


  const handleExportToExcel = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      alert("No users to export.");
      return;
    }

    // Define which fields you want to export
    const exportData = filteredUsers.map(user => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Mobile: user.mobile,
      Address: user.address,
      Status: user.status,
      Balance: user.current_balance,
      Gave: user.total_credit_given,
      Got: user.total_payment_got,
      CreatedAt: user.created_at ? format(new Date(user.created_at), 'dd/MM/yyyy') : '',
      UpdatedAt: user.updated_at ? format(new Date(user.updated_at), 'dd/MM/yyyy') : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "UsersList.xlsx");
  };

  const fetchUsersDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found.");
        return;
      }

      const response = await ApiService.get("dashboard/user-stats", null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.success) {
        const data = response;
        setUsersList(data?.AllUsers);
        setUsersTotalCount(data?.totalUsers);
        setlLast30DaysCount(data?.recentUsersLastXDays);
        setTotalTransactions(data?.totalBalance)

      } else {
        alert(response?.data?.message || "Failed to load user data.");
      }
    } catch (err) {
      console.error("Users API Error:", err);
      setError(err.response?.data?.message || "Server error while fetching user data.");
    }
  };

  const fetchUsersDetailsByID = async (userId) => {

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      const response = await ApiService.post("dashboard/businessOwner", { userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.success) {
        setSelectedUser(response?.businessOwnerDetails);
        setCustomerCount(response?.CustomersCount);
        console.log("customerCount ::", customerCount)
        setCustomer(response?.Customers);
        console.log("customer ::", customer)
        setSupplierCount(response?.SupplierCount);
        console.log("supplierCount::", supplierCount)
        setSupplier(response?.Suppliers);
        console.log("supplier::", supplier)

      } else {
        alert(response?.data?.message || "Failed to load user data.");
      }
    } catch (err) {
      console.error("Users API Error:", err);
      setError(err.response?.data?.message || "Server error while fetching user data.");
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const rrr = JSON.parse(userData)
    setUsersData(rrr)
    fetchUsersDetails();
  }, []);



  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user?.mobile?.includes(searchTerm);
    return matchesSearch;
  });

  const handleViewUser = (user) => {

    setShowUserDetails(true);
    fetchUsersDetailsByID(user.id)
  };

  const UserDetailsModal = () => {
    if (!showUserDetails || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Business Owner Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar + Name + Status */}
            <div className="flex items-center space-x-4">
              {selectedUser?.photo ? (
                <img
                  src={selectedUser.photo}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {selectedUser?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-gray-600">Business Owner</p>
                <StatusBadge status={selectedUser.status} />
              </div>
            </div>

            {/* Contact + Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedUser.mobile || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedUser.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedUser.address || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600">Verified:</span>
                    <span className={`font-semibold ${selectedUser.is_verified ? "text-green-600" : "text-red-500"}`}>
                      {selectedUser.is_verified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Business Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Name:</span>
                    <span className="font-medium">{selectedUser.businessName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Type:</span>
                    <span className="font-medium">{selectedUser.businessType || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST:</span>
                    <span className="font-medium">{selectedUser.GST || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900">Account Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Join Date:</span>
                  <span className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date(selectedUser.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className={`font-medium ${parseFloat(selectedUser.current_balance) < 0 ? "text-red-600" : "text-green-600"}`}>
                    ₹{selectedUser.current_balance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Credit Given:</span>
                  <span className="font-medium text-blue-600">₹{selectedUser.total_credit_given}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payment Received:</span>
                  <span className="font-medium text-orange-600">₹{selectedUser.total_payment_got}</span>
                </div>
              </div>
            </div>

            {/* Customers Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 flex justify-between">
                Customers <span className="text-sm font-normal text-gray-500">Total: {customerCount || 0}</span>
              </h4>
              {customer?.length > 0 ? (
                <div className="overflow-auto max-h-48 border rounded-lg">
                  <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Mobile</th>
                        <th className="px-4 py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer.map((customer) => (
                        <tr key={customer.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{customer.name}</td>
                          <td className="px-4 py-2">{customer.mobile || "—"}</td>
                          <td className="px-4 py-2 text-green-600">₹{customer.current_balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No customers found.</p>
              )}
            </div>

            {/* Suppliers Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 flex justify-between">
                Suppliers <span className="text-sm font-normal text-gray-500">Total: {supplierCount || 0}</span>
              </h4>
              {supplier?.length > 0 ? (
                <div className="overflow-auto max-h-48 border rounded-lg">
                  <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Mobile</th>
                        <th className="px-4 py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.map((supplier) => (
                        <tr key={supplier.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{supplier.name}</td>
                          <td className="px-4 py-2">{supplier.mobile || "—"}</td>
                          <td className="px-4 py-2 text-green-600">₹{supplier.current_balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No suppliers found.</p>
              )}
            </div>


            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowUserDetails(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all platform users and their accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Customer with Subscription</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleExportToExcel}>
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />

          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{usersTotalCount}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">last 30 Days Active </p>
              <p className="text-2xl font-bold text-gray-900">{last30DaysCount}</p>
            </div>
            <Activity className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions </p>
              <p className="text-2xl font-bold text-gray-900">{Math.abs(totalTransactions)}</p>
            </div>
            <Activity className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <CustomerCard
            key={user.id}
            customer={user}
            onView={handleViewUser} isView={true}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <UserDetailsModal />

      <CreateCustomerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // Refresh the users list after successful creation
          fetchUsersDetails();
        }}
      />
    </div>
  );
}

export default UsersPage;