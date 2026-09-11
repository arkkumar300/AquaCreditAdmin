import React from 'react';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, User, Plus, Download, Building2, Phone, Mail, MapPin, Calendar, Activity } from 'lucide-react';
import { format } from 'date-fns';

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

const CustomerCard = ({ customer, onView, isView }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {customer?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900" style={{ textTransform: 'capitalize' }}>
                {customer?.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {customer?.status && <StatusBadge status={customer?.status} />}
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="h-4 w-4 text-blue-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{customer?.mobile}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{customer?.email || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{customer?.address || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(customer?.created_at), 'dd/MM/yyyy')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">
              Credit: <span className="font-semibold text-blue-600">₹{customer?.total_credit_given || 0}</span>
            </span>
            <span className="text-gray-600">
              Payment: <span className="font-semibold text-orange-600">₹{customer?.total_payment_got || 0}</span>
            </span>
            <span className="text-gray-600">
              Balance: <span className="font-semibold text-green-600">₹{customer?.current_balance || 0}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {isView && (
              <button
                onClick={() => onView(customer)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;