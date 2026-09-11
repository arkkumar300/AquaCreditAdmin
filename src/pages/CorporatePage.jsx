import React, { useState } from 'react';
import { Building2, Users, TrendingUp, Eye, Edit, Plus, Search, Filter } from 'lucide-react';

const CorporateCard = ({ company }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
          {company?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{company.name}</h3>
          <p className="text-sm text-gray-600">{company.industry}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {company.status}
      </span>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-600">{company.employeeCount}</p>
        <p className="text-xs text-gray-600">Employees</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">₹{company.totalRevenue}</p>
        <p className="text-xs text-gray-600">Revenue</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-purple-600">{company.customers}</p>
        <p className="text-xs text-gray-600">Customers</p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <span className="text-sm text-gray-600">Joined: {company.joinDate}</span>
      <div className="flex items-center space-x-2">
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Eye className="h-4 w-4" />
        </button>
        <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
          <Edit className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

function CorporatePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const companies = [
    {
      id: 1,
      name: 'ABC Enterprises Ltd',
      industry: 'Manufacturing',
      employeeCount: 25,
      totalRevenue: '12.5L',
      customers: 156,
      status: 'active',
      joinDate: '15 Jan 2024',
      location: 'Mumbai, MH'
    },
    {
      id: 2,
      name: 'XYZ Trading Co',
      industry: 'Trading',
      employeeCount: 12,
      totalRevenue: '8.3L',
      customers: 89,
      status: 'active',
      joinDate: '22 Feb 2024',
      location: 'Delhi, DL'
    },
    {
      id: 3,
      name: 'Tech Solutions Pvt Ltd',
      industry: 'Technology',
      employeeCount: 45,
      totalRevenue: '25.7L',
      customers: 234,
      status: 'active',
      joinDate: '08 Mar 2024',
      location: 'Bangalore, KA'
    }
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corporate Accounts</h1>
          <p className="text-gray-600 mt-1">Manage corporate clients and their teams</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Company</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">15,678</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹45.8Cr</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Today</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
            </div>
            <Building2 className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <CorporateCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}

export default CorporatePage;