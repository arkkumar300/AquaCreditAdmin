//customer page
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MoreVertical, Eye, UserPlus, Edit, Trash2, User, Plus, Download, Building2, Phone, Mail, MapPin, Calendar, Activity } from 'lucide-react';
import ApiService from '../services/ApiService';
import { format } from 'date-fns';
import CustomerCard from '../components/CustomerCard';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function CustomerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [customersData, setCustomersData] = useState(null);
  const [customerExportData, setCustomerExportData] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [customersTotalCount, setCustomersTotalCount] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [selectedCustomerList, setSelectedCustomerList] = useState([]);
  const [last30DaysCount, setlLast30DaysCount] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

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
    if (!customerExportData || customerExportData.length === 0) {
      alert("No users to export.");
      return;
    }
    // Define which fields you want to export
    
    const exportData = customerExportData.map(customer => ({
      ID: customer.id,
      Name: customer.name,
      Email: customer.email,
      Mobile: customer.mobile,
      Address: customer.address,
      Status: customer.status,
      Balance: customer.current_balance,
      Gave: customer.total_credit_given,
      Got: customer.total_payment_got,
      CreatedAt: customer.created_at ? format(new Date(customer.created_at), 'dd/MM/yyyy') : '',
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer");
  
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    saveAs(blob, "CustomerList.xlsx");
  };


  const fetchCustomersDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      const response = await ApiService.get("dashboard/customer-stats", null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.success) {
        const data = response;
        // Use Customers array directly – no AllCustomers key
        setCustomerExportData(data?.Customers || []);
        setCustomersList(data?.Customers || []);
        setCustomersTotalCount(data?.totalCustomers || 0);
        setlLast30DaysCount(data?.recentCustomersLastXDays || 0);
        setTotalTransactions(data?.totalBalance || 0);

      } else {
        alert(response?.data?.message || "Failed to load customer data.");
      }
    } catch (err) {
      console.error("Customers API Error:", err);
      console.log(err.response?.data?.message || "Server error while fetching customer data.");
    }
  };

  const fetchCustomerDetailsByID = async (mobile) => {
    console.log("rrr::", mobile)
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      const response = await ApiService.post("customers/getCustomersByMobile", { mobile }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setCustomerCount(response?.totalCustomers);
        console.log("customerCount ::", customerCount)
        setSelectedCustomerList(response?.customers);
        console.log("customer ::", selectedCustomerList)

      } else {
        alert(response?.data?.message || "Failed to load user data.");
      }
    } catch (err) {
      console.error("Users API Error:", err);
      alert(err.response?.data?.message || "Server error while fetching user data.");
    }
  };


  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const rrr = JSON.parse(userData)

    setCustomersData(rrr)
    fetchCustomersDetails();
  }, []);


  const filteredCustomers = customersList?.filter(customer => {
    const matchesSearch = customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      customer?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      customer?.mobile?.includes(searchTerm);
    return matchesSearch;
  });

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
    fetchCustomerDetailsByID(customer?.mobile)
  };

  const CustomerDetailsModal = () => {
    if (!showCustomerDetails || !selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
              <button
                onClick={() => setShowCustomerDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar + Name + Status */}
            <div className="flex items-center space-x-4">
              {selectedCustomer?.photo ? (
                <img
                  src={selectedCustomer.photo}
                  alt={selectedCustomer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {selectedCustomer?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-gray-600">Customer</p>
                <StatusBadge status={selectedCustomer.status} />
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
                    <span className="text-gray-700">{selectedCustomer.mobile || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedCustomer.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedCustomer.address || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600">Verified:</span>
                    <span className={`font-semibold ${selectedCustomer.is_verified ? "text-green-600" : "text-red-500"}`}>
                      {selectedCustomer.is_verified ? "Yes" : "No"}
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
                    <span className="font-medium">{selectedCustomer.businessName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Type:</span>
                    <span className="font-medium">{selectedCustomer.businessType || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST:</span>
                    <span className="font-medium">{selectedCustomer.GST || "N/A"}</span>
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
                  <span className="font-medium">{new Date(selectedCustomer.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date(selectedCustomer.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className={`font-medium ${parseFloat(selectedCustomer.current_balance) < 0 ? "text-red-600" : "text-green-600"}`}>
                    ₹{selectedCustomer.current_balance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Credit Given:</span>
                  <span className="font-medium text-blue-600">₹{selectedCustomer.total_credit_given}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payment Received:</span>
                  <span className="font-medium text-orange-600">₹{selectedCustomer.total_payment_got}</span>
                </div>
              </div>
            </div>

            {/* Customers Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 flex justify-between">
                Customers <span className="text-sm font-normal text-gray-500">Total: {customerCount || 0}</span>
              </h4>

              {/* "id": 1,
            "business_owner_id": 1,
            "photo": null,
            "name": "raju",
            "mobile": "9030268863",
            "email": null,
            "address": null,
            "current_balance": "200.00",
            "total_credit_given": "300.00",
            "total_payment_got": "100.00",
            "status": "Active",
            "created_at": "2025-09-08T06:12:00.000Z",
            "updated_at": "2025-09-10T13:38:33.000Z",
            "businessOwner": {
                "id": 1,
                "name": "ravi",
                "email": null,
                "mobile": "9494130830"
            } */}
              {selectedCustomerList?.length > 0 ? (
                <div className="overflow-auto max-h-48 border rounded-lg">
                  <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Mobile</th>
                        <th className="px-4 py-2">Payments</th>
                        <th className="px-4 py-2">Credit</th>
                        <th className="px-4 py-2">Balance</th>
                        <th className="px-4 py-2">BusinessOwner</th>
                        <th className="px-4 py-2">CreatedAt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomerList.map((customer) => (
                        <tr key={customer.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="flex items-center space-x-4">
                              {customer?.photo ? (
                                <img
                                  src={customer.photo}
                                  alt={customer.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                                  {customer?.name?.charAt(0).toUpperCase()}
                                </div>
                              )}</div>
                          </td>
                          <td className="px-4 py-2">{customer.mobile || "—"}</td>
                          <td className="px-4 py-2">₹ {customer.total_payment_got || 0}</td>
                          <td className="px-4 py-2">₹ {customer.total_credit_given || 0}</td>
                          <td className="px-4 py-2 text-green-600">₹ {customer.current_balance || 0}</td>
                          <td className="px-4 py-2 text-green-600">{customer?.businessOwner?.name || "—"}</td>
                          <td className="px-4 py-2 text-green-600">{customer.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No customers found.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowCustomerDetails(false)}
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage all platform customers and their accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleExportToExcel}>
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          {/* <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="h-4 w-4" />
            <span>Add Customer</span>
          </button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
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
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customersTotalCount}</p>
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onView={handleViewCustomer} isView={true}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <CustomerDetailsModal />
    </div>
  );
}

export default CustomerPage;