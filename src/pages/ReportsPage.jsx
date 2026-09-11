import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Filter, Users, CreditCard, Package, DollarSign } from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
    </div>
  </div>
);

const ReportCard = ({ title, description, lastGenerated, onGenerate }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <p className="text-xs text-gray-500">Last generated: {lastGenerated}</p>
      </div>
      <button 
        onClick={onGenerate}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download className="h-4 w-4" />
        <span>Generate</span>
      </button>
    </div>
  </div>
);

function ReportsPage() {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('all');

  const reports = [
    {
      id: 1,
      title: 'User Activity Report',
      description: 'Detailed analysis of user registrations, logins, and platform usage patterns',
      lastGenerated: '2 hours ago'
    },
    {
      id: 2,
      title: 'Transaction Summary',
      description: 'Complete overview of all transactions including payments, credits, and outstanding amounts',
      lastGenerated: '1 day ago'
    },
    {
      id: 3,
      title: 'Customer Health Analysis',
      description: 'Status breakdown of all customers with payment patterns and risk assessment',
      lastGenerated: '3 days ago'
    },
    {
      id: 4,
      title: 'Corporate Performance Report',
      description: 'Revenue, employee activity, and growth metrics for corporate accounts',
      lastGenerated: '1 week ago'
    },
    {
      id: 5,
      title: 'Stock Movement Report',
      description: 'Inventory changes, stock levels, and product performance across all locations',
      lastGenerated: '2 days ago'
    },
    {
      id: 6,
      title: 'Revenue Analytics',
      description: 'Comprehensive revenue analysis with trends, forecasts, and comparative data',
      lastGenerated: '5 hours ago'
    }
  ];

  const handleGenerateReport = (reportId) => {
    console.log(`Generating report ${reportId} for ${dateRange} days`);
    // Implement report generation logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive reports and analyze platform performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="₹24.5L"
          change="+12.5% from last month"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Active Users"
          value="8,456"
          change="+8.2% from last month"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Transactions"
          value="12,847"
          change="+15.3% from last month"
          icon={CreditCard}
          trend="up"
        />
        <MetricCard
          title="Stock Items"
          value="2,345"
          change="-2.1% from last month"
          icon={Package}
          trend="down"
        />
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Metrics</option>
              <option value="revenue">Revenue</option>
              <option value="users">Users</option>
              <option value="transactions">Transactions</option>
            </select>
          </div>
        </div>

        {/* Chart placeholder */}
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600">Interactive charts and graphs would be displayed here</p>
            <p className="text-sm text-gray-500 mt-2">Showing data for the last {dateRange} days</p>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              title={report.title}
              description={report.description}
              lastGenerated={report.lastGenerated}
              onGenerate={() => handleGenerateReport(report.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-sm text-gray-600">Payment Success Rate</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">4.8</div>
            <p className="text-sm text-gray-600">Average App Rating</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">68%</div>
            <p className="text-sm text-gray-600">Customer Retention</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;