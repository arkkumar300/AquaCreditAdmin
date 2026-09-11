// employees page
import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Eye, Edit, Trash2, UserX, UserCheck, 
  User, Mail, Phone, X, Save, AlertCircle 
} from 'lucide-react';
import ApiService from '../services/ApiService';

const EmployeesPage = () => {
  // State
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form states for add/edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No access token found.');
        setLoading(false);
        return;
      }

      const response = await ApiService.get('admin/employees', null, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response?.success) {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } else {
        setError(response?.message || 'Failed to fetch employees.');
      }
    } catch (err) {
      console.error('Fetch employees error:', err);
      setError(err.response?.data?.message || 'Server error while fetching employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(term) ||
            emp.email.toLowerCase().includes(term) ||
            emp.mobile.includes(term)
        )
      );
    }
  }, [searchTerm, employees]);

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', email: '', mobile: '', password: '' });
    setFormError('');
    setFormSuccess('');
    setIsSubmitting(false);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmitting(true);

    const { name, email, mobile, password } = formData;
    if (!name || !email || !mobile || !password) {
      setFormError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setFormError('No access token found.');
        setIsSubmitting(false);
        return;
      }

      const response = await ApiService.post(
        'admin/employee',
        { name, email, mobile, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.success) {
        setFormSuccess('Employee added successfully!');
        resetForm();
        fetchEmployees(); // Refresh list
        setTimeout(() => {
          setShowAddModal(false);
          setFormSuccess('');
        }, 1500);
      } else {
        setFormError(response?.message || 'Failed to add employee.');
      }
    } catch (err) {
      console.error('Add employee error:', err);
      setFormError(err.response?.data?.message || 'Server error while adding employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update employee (edit)
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmitting(true);

    const { name, email, mobile } = formData;
    if (!name || !email || !mobile) {
      setFormError('Name, email and mobile are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setFormError('No access token found.');
        setIsSubmitting(false);
        return;
      }

      // Assuming PUT /employees/:id exists
      const response = await ApiService.put(
        `admin/${selectedEmployee.id}`,
        { name, email, mobile },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.success) {
        setFormSuccess('Employee updated successfully!');
        fetchEmployees();
        setTimeout(() => {
          setShowEditModal(false);
          setFormSuccess('');
          setSelectedEmployee(null);
        }, 1500);
      } else {
        setFormError(response?.message || 'Failed to update employee.');
      }
    } catch (err) {
      console.error('Update employee error:', err);
      setFormError(err.response?.data?.message || 'Server error while updating employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deactivate employee
  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this employee?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found.');
        return;
      }

      const response = await ApiService.put(
        `admin/employees/${id}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.success) {
        alert('Employee deactivated successfully.');
        fetchEmployees();
      } else {
        alert(response?.message || 'Failed to deactivate employee.');
      }
    } catch (err) {
      console.error('Deactivate error:', err);
      alert(err.response?.data?.message || 'Server error while deactivating employee.');
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found.');
        return;
      }

      const response = await ApiService.delete(
        `admin/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.success) {
        alert('Employee deleted successfully.');
        fetchEmployees();
      } else {
        alert(response?.message || 'Failed to delete employee.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Server error while deleting employee.');
    }
  };

  // Open view modal
  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  // Open edit modal
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      mobile: employee.mobile,
      password: '', // not shown in edit
    });
    setFormError('');
    setFormSuccess('');
    setShowEditModal(true);
  };

  // Open add modal
  const handleAddOpen = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Render status badge
  const StatusBadge = ({ isActive }) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  // Loading state
  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage your employees and their access</p>
        </div>
        <button
          onClick={handleAddOpen}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.mobile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge isActive={employee.is_active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View */}
                        <button
                          onClick={() => handleView(employee)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(employee)}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {/* Deactivate */}
                        {employee.is_active ? (
                          <button
                            onClick={() => handleDeactivate(employee.id)}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Deactivate"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeactivate(employee.id)} // Could also reactivate, but route only deactivates
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Activate (not implemented)"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Total: {filteredEmployees.length} employees
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                  {formSuccess}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Add Employee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Employee Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-semibold">
                  {selectedEmployee.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h3>
                  <StatusBadge isActive={selectedEmployee.is_active} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{selectedEmployee.mobile}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <User className="h-5 w-5 text-gray-400" />
                  <span>Role: {selectedEmployee.role || 'employee'}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 text-sm">
                  <span className="text-gray-500">Employee ID:</span>
                  <span>{selectedEmployee.id}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Employee</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateEmployee} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                  {formSuccess}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Updating...' : 'Update Employee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;