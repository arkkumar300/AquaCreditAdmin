import React, { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
  UserCheck,
  Database,
  Subscript
} from 'lucide-react';
import ApiService from '../services/ApiService';
import CustomerCard from '../components/CustomerCard';



const StatCard = ({ title, value, change, icon: Icon, color, trend,onSelect}) => {

  return(
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]" onClick={onSelect}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-yellow-600'}`}>
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
)};

// const CustomerStatusCard = ({ status, count, color, percentage }) => (
//   <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//     <div className="flex items-center justify-between">
//       <div>
//         <div className={`w-4 h-4 rounded-full ${color} mb-2`}></div>
//         <p className="text-sm font-medium text-gray-600">{status}</p>
//         <p className="text-2xl font-bold text-gray-900">{count}</p>
//       </div>
//       <div className="text-right">
//         <p className="text-sm text-gray-500">{percentage}%</p>
//       </div>
//     </div>
//   </div>
// );

// const RecentActivity = ({ activities }) => (
//   <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//     <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
//     <div className="space-y-4">
//       {activities.map((activity, index) => (
//         <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//           <div className={`p-2 rounded-full ${activity.color} bg-opacity-10`}>
//             <activity.icon className={`h-4 w-4 ${activity.color.replace('bg-', 'text-')}`} />
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-medium text-gray-900">{activity.title}</p>
//             <p className="text-xs text-gray-500">{activity.time}</p>
//           </div>
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.statusColor}`}>
//             {activity.status}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>
// );

function Dashboard() {

  const [dashboardUser, setDashboardUser] = useState(null);
  const [dashboardCustomer, setDashboardCustomer] = useState(null);
  const [dashboardSupplier, setDashboardSupplier] = useState(null);
  const [userData, setUserData] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [usersLastMonth, setUsersLastMonth] = useState(0);
  const [usersThisMonth, setUsersThisMonth] = useState(0);
  const [suppliersLastMonth, setSuppliersLastMonth] = useState(0);
  const [suppliersThisMonth, setSuppliersThisMonth] = useState(0);
  const [customersLastMonth, setCustomersLastMonth] = useState(0);
  const [customersThisMonth, setCustomersThisMonth] = useState(0);
  const [totalTransactionsAmount, setTotalTransactionsAmount] = useState(0);
  const [giveTransactionsAmount, setGiveTransactionsAmount] = useState(0);
  const [gotTransactionsAmount, setGotTransactionsAmount] = useState(0);
  const [transactionsLastMonth, setTransactionsLastMonth] = useState(0);
  const [transactionsThisMonth, setTransactionsThisMonth] = useState(0);
  const [error, setError] = useState(null);


  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found.");
        return;
      }

      const response = await ApiService.get("dashboard", null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.success) {
        const data = response;
        setDashboardUser(data?.Users);
        setUsersList(data?.Users?.rows);
        setUsersLastMonth(data?.lastMonthUsers || 0);
        setUsersThisMonth(data?.thisMonthUsers || 0);
        setDashboardCustomer(data?.Customers);
        setCustomersList(data?.Customers?.rows);
        setCustomersLastMonth(data?.lastMonthCustomers || 0);
        setCustomersThisMonth(data?.thisMonthCustomers || 0);
        setDashboardSupplier(data?.Suppliers);
        setSuppliersList(data?.Suppliers?.rows);
        setSuppliersLastMonth(data?.lastMonthSuppliers || 0);
        setSuppliersThisMonth(data?.thisMonthSuppliers || 0);
        setTotalTransactionsAmount(data?.totalTransactionsAmount || 0);
        setGiveTransactionsAmount(data?.giveTransactionsAmount || 0);
        setGotTransactionsAmount(data?.gotTransactionsAmount || 0);
        setTransactionsLastMonth(data?.lastMonthTransactionsAmount || 0);
        setTransactionsThisMonth(data?.thisMonthTransactionsAmount || 0);

      } else {
        setError(response?.data?.message || "Failed to load dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(err.response?.data?.message || "Server error while fetching dashboard data.");
    }
  };
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const rrr = JSON.parse(userData)

    setUserData(rrr)
    fetchDashboardData();
  }, []);
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back,<span style={{ textTransform: 'capitalize', paddingLeft: 5 }}>{userData?.role}</span> ! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardUser?.count}
          change={`+${((usersThisMonth - usersLastMonth) / (usersLastMonth + usersThisMonth)) * 100 || 0}% from last month`}
          icon={Users}
          color="bg-blue-500"
          trend={usersThisMonth > usersLastMonth ? "up" : "down"}
          onSelect={()=>{
            setFilterData(usersList)
          }}
        />
        <StatCard
          title="Total Customers"
          value={dashboardCustomer?.count}
          change={`+${((customersThisMonth - customersLastMonth) / (customersLastMonth + customersThisMonth)) * 100 || 0}% from last month`}
          icon={Database}
          color="bg-blue-500"
          trend={customersThisMonth > customersLastMonth ? "up" : "down"}
          onSelect={()=>{
            setFilterData(customersList)
          }}
        />

        <StatCard
          title="Total Suppliers"
          value={dashboardSupplier?.count}
          change={`${((suppliersThisMonth - suppliersLastMonth) / (suppliersLastMonth + suppliersThisMonth)) * 100 || 0}% from last month`}
          icon={Subscript}
          color="bg-blue-500"
          trend={suppliersThisMonth > suppliersLastMonth ? "up" : "down"}
          onSelect={()=>{
            setFilterData(suppliersList)
          }}
        />
        <StatCard
          title="Total Transactions"
          value={totalTransactionsAmount || 0}
          change={`+${((transactionsThisMonth - transactionsLastMonth) / (transactionsLastMonth + transactionsThisMonth)) * 100 || 0}% from last month`}
          icon={Clock}
          color="bg-yellow-500"
          trend={transactionsThisMonth > transactionsLastMonth ? "up" : "down"}
        />
        <StatCard
          title="Total Give Transactions"
          value={giveTransactionsAmount || 0}
          change={`+${(giveTransactionsAmount / totalTransactionsAmount) * 100 || 0}% `}
          icon={Clock}
          color="bg-yellow-500"
          trend={transactionsThisMonth > transactionsLastMonth ? "up" : "down"}
        />
        <StatCard
          title="Total Got Transactions"
          value={gotTransactionsAmount || 0}
          change={`+${(gotTransactionsAmount / totalTransactionsAmount) * 100 || 0}% from last month`}
          icon={Clock}
          color="bg-yellow-500"
          trend={transactionsThisMonth > transactionsLastMonth ? "up" : "down"}
        />
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filterData.map((customer) => { 
            console.log("rrr ::",customer)
            return(
            <CustomerCard
              key={customer.id}
              customer={customer}
              isView={false} />
          )})}
        </div>

        {/* Customer Status Overview */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Health Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <CustomerStatusCard
              status="Healthy"
              count="8,456"
              color="bg-green-500"
              percentage="68"
            />
            <CustomerStatusCard
              status="Moderate"
              count="2,134"
              color="bg-yellow-500"
              percentage="17"
            />
            <CustomerStatusCard
              status="Delayed"
              count="1,567"
              color="bg-red-500"
              percentage="12"
            />
            <CustomerStatusCard
              status="Defaulter"
              count="390"
              color="bg-black"
              percentage="3"
            />
          </div>
        </div> */}

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors">
              <UserCheck className="h-5 w-5" />
              <span>Approve KYC Requests</span>
              <span className="ml-auto bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">12</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors">
              <CreditCard className="h-5 w-5" />
              <span>Review Transactions</span>
              <span className="ml-auto bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">8</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 transition-colors">
              <AlertTriangle className="h-5 w-5" />
              <span>Fraud Alerts</span>
              <span className="ml-auto bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">3</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors">
              <Package className="h-5 w-5" />
              <span>Stock Updates</span>
              <span className="ml-auto bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">15</span>
            </button>
          </div>
        </div> */}

        {/* Revenue Overview */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today's Revenue</span>
              <span className="font-semibold text-green-600">₹45,280</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="font-semibold text-blue-600">₹12,45,670</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Outstanding</span>
              <span className="font-semibold text-red-600">₹2,34,890</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Collection Rate</span>
                <span className="font-semibold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>
            </div>
          </div>
        </div> */}

    </div>
  );
}

export default Dashboard;