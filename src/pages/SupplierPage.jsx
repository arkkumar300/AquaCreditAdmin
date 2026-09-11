//supplier page

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, UserPlus, Download, Building2, User, Phone, Mail, MapPin, Calendar, Activity } from 'lucide-react';
import ApiService from '../services/ApiService';
import CustomerCard from '../components/CustomerCard';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [suppliersData, setSuppliersData] = useState(null);
  const [suppliersList, setSuppliersList] = useState([]);
  const [suppliersTotalCount, setSuppliersTotalCount] = useState(0);
  const [last30DaysCount, setlLast30DaysCount] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierCount, setSupplierCount] = useState(0);
  const [selectedSupplierList, setSelectedSupplierList] = useState([]);
  const [supplierExportData, setSupplierExportData] = useState([]);

  const [showSupplierDetails, setShowSupplierDetails] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);

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
    if (!supplierExportData || supplierExportData.length === 0) {
      alert("No users to export.");
      return;
    }
    // Define which fields you want to export
    
    const exportData = supplierExportData.map(supplier => ({
      ID: supplier.id,
      Name: supplier.name,
      Email: supplier.email,
      Mobile: supplier.mobile,
      Address: supplier.address,
      Status: supplier.status,
      Balance: supplier.current_balance,
      Gave: supplier.total_credit_given,
      Got: supplier.total_payment_got,
      CreatedAt: supplier.created_at ? format(new Date(supplier.created_at), 'dd/MM/yyyy') : '',
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Supplier");
  
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    saveAs(blob, "SupplierList.xlsx");
  };

  const fetchSuppliersDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      const response = await ApiService.get("dashboard/supplier-stats", null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.success) {
        const data = response;
        // Use Suppliers array directly – no AllSuppliers key
        setSupplierExportData(data?.Suppliers || []);
        setSuppliersList(data?.Suppliers || []);
        setSuppliersTotalCount(data?.totalSuppliers || 0);
        setlLast30DaysCount(data?.recentSuppliersLastXDays || 0);
        setTotalTransactions(data?.totalBalance || 0);

      } else {
        alert(response?.data?.message || "Failed to load supplier data.");
      }
    } catch (err) {
      console.error("Suppliers API Error:", err);
      alert(err.response?.data?.message || "Server error while fetching supplier data.");
    }
  };

  const fetchSupplierDetailsByID = async (mobile) => {
    console.log("rrr::", mobile)
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No access token found.");
        return;
      }

      const response = await ApiService.post("supplier/web/getSupplierByMobile", { mobile }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setSupplierCount(response?.totalSupplier);
        setSelectedSupplierList(response?.suppliers);
        console.log("supplierCount ::", supplierCount)
        console.log("supplier ::", selectedSupplierList)

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

    setSuppliersData(rrr)
    fetchSuppliersDetails();
  }, []);


  const filteredSuppliers = suppliersList?.filter(supplier => {
    const matchesSearch = supplier?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      supplier?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      supplier?.mobile?.includes(searchTerm);
    return matchesSearch;
  });

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierDetails(true);
    fetchSupplierDetailsByID(supplier.mobile)
  };

  const SupplierDetailsModal = () => {
    if (!showSupplierDetails || !selectedSupplier) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Supplier Details</h2>
              <button
                onClick={() => setShowSupplierDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar + Name + Status */}
            <div className="flex items-center space-x-4">
              {selectedSupplier?.photo ? (
                <img
                  src={selectedSupplier.photo}
                  alt={selectedSupplier.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {selectedSupplier?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedSupplier.name}</h3>
                <p className="text-gray-600">Supplier</p>
                <StatusBadge status={selectedSupplier.status} />
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
                    <span className="text-gray-700">{selectedSupplier.mobile || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedSupplier.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedSupplier.address || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600">Verified:</span>
                    <span className={`font-semibold ${selectedSupplier.is_verified ? "text-green-600" : "text-red-500"}`}>
                      {selectedSupplier.is_verified ? "Yes" : "No"}
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
                    <span className="font-medium">{selectedSupplier.businessName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Type:</span>
                    <span className="font-medium">{selectedSupplier.businessType || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST:</span>
                    <span className="font-medium">{selectedSupplier.GST || "N/A"}</span>
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
                  <span className="font-medium">{new Date(selectedSupplier.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date(selectedSupplier.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className={`font-medium ${parseFloat(selectedSupplier.current_balance) < 0 ? "text-red-600" : "text-green-600"}`}>
                    ₹{selectedSupplier.current_balance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Credit Given:</span>
                  <span className="font-medium text-blue-600">₹{selectedSupplier.total_credit_given}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payment Received:</span>
                  <span className="font-medium text-orange-600">₹{selectedSupplier.total_payment_got}</span>
                </div>
              </div>
            </div>

            {/* Suppliers Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 flex justify-between">
                Suppliers <span className="text-sm font-normal text-gray-500">Total: {supplierCount || 0}</span>
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
              {selectedSupplierList?.length > 0 ? (
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
                      {selectedSupplierList.map((supplier) => (
                        <tr key={supplier.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="flex items-center space-x-4">
                              {supplier?.photo ? (
                                <img
                                  src={supplier.photo}
                                  alt={supplier.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                                  {supplier.name?.charAt(0).toUpperCase()}
                                </div>
                              )}</div>
                          </td>
                          <td className="px-4 py-2">{supplier?.mobile || "—"}</td>
                          <td className="px-4 py-2">₹ {supplier?.total_payment_got || 0}</td>
                          <td className="px-4 py-2">₹ {supplier?.total_credit_given || 0}</td>
                          <td className="px-4 py-2 text-green-600">₹ {supplier?.current_balance || 0}</td>
                          <td className="px-4 py-2 text-green-600">{supplier?.businessOwner?.name || "—"}</td>
                          <td className="px-4 py-2 text-green-600">{supplier?.created_at}</td>
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
                onClick={() => setShowSupplierDetails(false)}
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
          <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-gray-600 mt-1">Manage all platform suppliers and their accounts</p>
        </div>
        <div className="flex items-center space-x-3">
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
              placeholder="Search suppliers by name, email, or phone..."
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
              <p className="text-sm text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliersTotalCount}</p>
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

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <CustomerCard
            key={supplier.id}
            customer={supplier}
            onView={handleViewSupplier} isView={true}
          />

        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <SupplierDetailsModal />
    </div>
  );
}

export default SuppliersPage;