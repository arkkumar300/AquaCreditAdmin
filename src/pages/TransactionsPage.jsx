import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Clock,
  AlertTriangle,
  CreditCard,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  IndianRupee,
} from "lucide-react";

import ApiService from "../services/ApiService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

const TransactionCard = ({ transaction }) => {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    return type === "credit" ? (
      <ArrowDownRight className="h-5 w-5 text-green-500" />
    ) : (
      <ArrowUpRight className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">{getTypeIcon("credit")}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
            <p className="text-sm text-gray-600">{transaction.user}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            transaction.status
          )}`}
        >
          {transaction.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Amount</p>
          <p className="font-bold text-lg text-gray-900">₹{transaction.amount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-medium text-gray-900">{transaction.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Transaction ID</p>
          <p className="font-mono text-sm text-gray-900">{transaction.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Payment Method</p>
          <p className="font-medium text-gray-900">{transaction.paymentMethod}</p>
        </div>
      </div>

      {transaction.note && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Note</p>
          <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{transaction.note}</p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [paymentsRaw, setPaymentsRaw] = useState([]); // <-- needed for Excel export

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // ----------------------------------------------------------
  // EXPORT EXCEL
  // ----------------------------------------------------------

  const handleExportToExcel = () => {
    if (!paymentsRaw || paymentsRaw.length === 0) {
      alert("No payments to export.");
      return;
    }

    const safeFormatDate = (dateString) => {
      if (!dateString) return "";
      try {
        return format(new Date(dateString), "dd/MM/yyyy");
      } catch {
        return "";
      }
    };

    const exportData = paymentsRaw.map((p) => ({
      ID: p.id,
      RazorpayOrderID: p.razorpay_order_id,
      RazorpayPaymentID: p.razorpay_payment_id ?? "",
      Amount: p.amount,
      Currency: p.currency,
      SubscriberName: p.subscriber_name ?? "",
      SubscriberEmail: p.subscriber_email ?? "",
      SubscriberPhone: p.subscriber_phone ?? "",
      Plan: p.subscribePlan ?? "",
      Status: p.status,
      ErrorMessage: p.error_message ?? "",
      PaymentDate: safeFormatDate(p.payment_date),
      CreatedAt: safeFormatDate(p.created_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `Payments_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fileName);
  };

  // ----------------------------------------------------------
  // FETCH PAYMENTS FROM API
  // ----------------------------------------------------------

  const fetchPayments = async (page = 1) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await ApiService.get(`/payment?page=${page}`,null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = response;

      setPaymentsRaw(data.payments); // <-- store original API data for export

      const mapped = data.payments.map((p) => ({
        id: p.razorpay_order_id,
        description: "Subscription Payment",
        user: p.subscriber_name,
        amount: Number(p.amount/100).toLocaleString(),
        type: "credit",
        status: p.status,
        date: new Date(p.payment_date).toLocaleDateString(),
        paymentMethod: "Online",
        note: p.error_message,
      }));

      setTransactions(mapped);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments(pagination.currentPage);
  }, [pagination.currentPage]);

  // ----------------------------------------------------------
  // FILTER TRANSACTIONS
  // ----------------------------------------------------------

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      transaction.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusCount = (status) => {
    return transactions.filter((t) => t.status.toLowerCase() === status).length;
  };

  const getTotalAmount = () => {
    return transactions
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/,/g, "")), 0)
      .toLocaleString();
  };

  // ----------------------------------------------------------
  // UI STARTS HERE
  // ----------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* -------------------- HEADER -------------------- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all platform transactions</p>
        </div>
        <button
          onClick={handleExportToExcel}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* -------------------- STATS CARDS -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Volume</p>
          <p className="text-2xl font-bold">₹{getTotalAmount()}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{getStatusCount("pending")}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Failed</p>
          <p className="text-2xl font-bold text-red-600">{getStatusCount("failed")}</p>
        </div>

      </div>

      {/* -------------------- FILTERS -------------------- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* -------------------- TRANSACTIONS LIST -------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTransactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">No transactions found</div>
      )}

      {/* -------------------- PAGINATION -------------------- */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          disabled={!pagination.hasPrev}
          onClick={() =>
            setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
          }
          className={`px-4 py-2 rounded-lg ${
            pagination.hasPrev ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Previous
        </button>

        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <button
          disabled={!pagination.hasNext}
          onClick={() =>
            setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))
          }
          className={`px-4 py-2 rounded-lg ${
            pagination.hasNext ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionsPage;
