import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';

const StockCard = ({ item }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 p-6">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.category}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        item.status === 'in-stock' ? 'bg-green-100 text-green-800' :
        item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {item.status.replace('-', ' ')}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-600">Current Stock</p>
        <p className="text-xl font-bold text-gray-900">{item.currentStock}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Price per Unit</p>
        <p className="text-xl font-bold text-green-600">₹{item.pricePerUnit}</p>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">Stock Level</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${
            item.stockPercentage > 70 ? 'bg-green-500' :
            item.stockPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{width: `${item.stockPercentage}%`}}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{item.stockPercentage}% of maximum capacity</p>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <span className="text-sm text-gray-600">SKU: {item.sku}</span>
      <div className="flex items-center space-x-2">
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Edit className="h-4 w-4" />
        </button>
        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

function StockPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const stockItems = [
    {
      id: 1,
      name: 'Premium Rice',
      category: 'Food Grains',
      currentStock: 500,
      maxCapacity: 1000,
      pricePerUnit: 45,
      status: 'in-stock',
      stockPercentage: 50,
      sku: 'PRC001'
    },
    {
      id: 2,
      name: 'Wheat Flour',
      category: 'Food Grains',
      currentStock: 150,
      maxCapacity: 500,
      pricePerUnit: 30,
      status: 'low-stock',
      stockPercentage: 30,
      sku: 'WF002'
    },
    {
      id: 3,
      name: 'Cooking Oil',
      category: 'Oils',
      currentStock: 0,
      maxCapacity: 200,
      pricePerUnit: 120,
      status: 'out-of-stock',
      stockPercentage: 0,
      sku: 'CO003'
    },
    {
      id: 4,
      name: 'Sugar',
      category: 'Food Items',
      currentStock: 300,
      maxCapacity: 400,
      pricePerUnit: 38,
      status: 'in-stock',
      stockPercentage: 75,
      sku: 'SUG004'
    }
  ];

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusCount = (status) => {
    return stockItems.filter(item => item.status === status).length;
  };

  const getTotalValue = () => {
    return stockItems.reduce((total, item) => total + (item.currentStock * item.pricePerUnit), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock & Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your inventory across all locations</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Stock Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stockItems.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">₹{getTotalValue().toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('low-stock')}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('out-of-stock')}</p>
            </div>
            <Package className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Food Grains">Food Grains</option>
            <option value="Oils">Oils</option>
            <option value="Food Items">Food Items</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <StockCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}

export default StockPage;