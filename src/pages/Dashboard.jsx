import React, { useEffect, useState } from 'react';
import {Users,Building2,CreditCard,TrendingUp,AlertTriangle,CheckCircle,XCircle,Clock,DollarSign,Package,UserCheck,Database,Subscript,Calendar} from 'lucide-react';
import ApiService from '../services/ApiService';
import CustomerCard from '../components/CustomerCard';

const StatCard = ({ title, value, change, icon: Icon, color, trend, onSelect }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend === 'up'
                  ? 'text-green-600'
                  : trend === 'down'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            >
              <TrendingUp className={`h-4 w-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-8 w-8 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
};

// Helper: format date to YYYY-MM-DD for <input type="date">
const toInputDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Default fromDate = start of current month, toDate = today
const getDefaultFromDate = () => {
  const now = new Date();
  return toInputDate(new Date(now.getFullYear(), now.getMonth(), 1));
};
const getDefaultToDate = () => toInputDate(new Date());

function Dashboard() {
  const [dashboardUser, setDashboardUser] = useState(null);
  const [dashboardCustomer, setDashboardCustomer] = useState(null);
  const [dashboardSupplier, setDashboardSupplier] = useState(null);
  const [userData, setUserData] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  // Range-based counts (from API)
  const [rangeUsers, setRangeUsers] = useState(0);
  const [rangeCustomers, setRangeCustomers] = useState(0);
  const [rangeSuppliers, setRangeSuppliers] = useState(0);
  const [rangeTransactionsAmount, setRangeTransactionsAmount] = useState(0);

  // Totals
  const [totalTransactionsAmount, setTotalTransactionsAmount] = useState(0);
  const [giveTransactionsAmount, setGiveTransactionsAmount] = useState(0);
  const [gotTransactionsAmount, setGotTransactionsAmount] = useState(0);

  // Date filter states (separate from/to)
  const [fromDate, setFromDate] = useState(getDefaultFromDate());
  const [toDate, setToDate] = useState(getDefaultToDate());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No access token found.');
        setLoading(false);
        return;
      }

      // Build query string for fromDate / toDate
      const params = new URLSearchParams();
      if (from) params.append('fromDate', from);
      if (to) params.append('toDate', to);
      const query = params.toString();
      const url = query ? `dashboard?${query}` : 'dashboard';

      const response = await ApiService.get(url, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response?.success) {
        const data = response;

        // Totals
        setDashboardUser(data?.Users);
        setUsersList(data?.Users?.rows || []);
        setDashboardCustomer(data?.Customers);
        setCustomersList(data?.Customers?.rows || []);
        setDashboardSupplier(data?.Suppliers);
        setSuppliersList(data?.Suppliers?.rows || []);

        // Range-based counts
        setRangeUsers(data?.rangeUsers || 0);
        setRangeCustomers(data?.rangeCustomers || 0);
        setRangeSuppliers(data?.rangeSuppliers || 0);
        setRangeTransactionsAmount(data?.rangeTransactionsAmount || 0);

        // Transaction totals
        setTotalTransactionsAmount(data?.totalTransactionsAmount || 0);
        setGiveTransactionsAmount(data?.giveTransactionsAmount || 0);
        setGotTransactionsAmount(data?.gotTransactionsAmount || 0);

        // Optionally sync the resolved dates echoed by the backend
        if (data?.fromDate) setFromDate(toInputDate(data.fromDate));
        if (data?.toDate) setToDate(toInputDate(data.toDate));
      } else {
        setError(response?.data?.message || 'Failed to load dashboard data.');
      }
    } catch (err) {
      console.error('Dashboard API Error:', err);
      setError(err.response?.data?.message || 'Server error while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // On mount: read userData & fetch with defaults
  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch {
        setUserData(null);
      }
    }
    fetchDashboardData(fromDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply date filter
  const handleApplyFilter = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setError('From date cannot be greater than To date.');
      return;
    }
    fetchDashboardData(fromDate, toDate);
  };

  // Reset to defaults (current month)
  const handleResetFilter = () => {
    const f = getDefaultFromDate();
    const t = getDefaultToDate();
    setFromDate(f);
    setToDate(t);
    fetchDashboardData(f, t);
  };

  // Percentage helper (safe division)
  const pct = (part, total) => {
    if (!total) return '0';
    return ((part / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back,
          <span style={{ textTransform: 'capitalize', paddingLeft: 5 }}>
            {userData?.role}
          </span>{' '}
          ! 👋
        </h1>
        <p className="text-blue-100">Here's what's happening with your platform today.</p>
      </div>

      {/* Date Filter Section (separate Start & End dates) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Date Range Filter</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleApplyFilter}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Apply'}
            </button>
            <button
              onClick={handleResetFilter}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Showing data from <strong>{fromDate || '—'}</strong> to <strong>{toDate || '—'}</strong>.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardUser?.count ?? 0}
          change={`${rangeUsers} in selected range`}
          icon={Users}
          color="bg-blue-500"
          trend="up"
          onSelect={() => setFilterData(usersList)}
        />
        <StatCard
          title="Total Customers"
          value={dashboardCustomer?.count ?? 0}
          change={`${rangeCustomers} in selected range`}
          icon={Database}
          color="bg-blue-500"
          trend="up"
          onSelect={() => setFilterData(customersList)}
        />
        <StatCard
          title="Total Suppliers"
          value={dashboardSupplier?.count ?? 0}
          change={`${rangeSuppliers} in selected range`}
          icon={Subscript}
          color="bg-blue-500"
          trend="up"
          onSelect={() => setFilterData(suppliersList)}
        />
        <StatCard
          title="Total Transactions"
          value={totalTransactionsAmount || 0}
          change={`${rangeTransactionsAmount || 0} in selected range`}
          icon={Clock}
          color="bg-yellow-500"
          trend="up"
        />
        <StatCard
          title="Total Give Transactions"
          value={giveTransactionsAmount || 0}
          change={`${pct(giveTransactionsAmount, totalTransactionsAmount)}% of total`}
          icon={Clock}
          color="bg-yellow-500"
          trend="up"
        />
        <StatCard
          title="Total Got Transactions"
          value={gotTransactionsAmount || 0}
          change={`${pct(gotTransactionsAmount, totalTransactionsAmount)}% of total`}
          icon={Clock}
          color="bg-yellow-500"
          trend="up"
        />
      </div>

      {/* Selected list cards (customers / users / suppliers) */}
      {filterData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filterData.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} isView={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;