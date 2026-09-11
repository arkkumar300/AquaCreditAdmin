import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {LayoutDashboard,Users,GroupIcon,Building2,UserCheck,CreditCard,Package,BarChart3,Bell,Settings,LogOut,Menu,X,Shield,FileCheck,Crown,UserCircle,User2} from 'lucide-react';

// Define allowed roles for each navigation item
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'employee'] },
  { name: 'User Management', path: '/users', icon: Users, roles: ['super_admin', 'admin'] },
  { name: 'Employee', path: '/employee', icon: GroupIcon, roles: ['super_admin'] },
  { name: 'Customer', path: '/customers', icon: UserCheck, roles: ['super_admin', 'admin', 'employee'] },
  { name: 'Supplier', path: '/suppliers', icon: UserCircle, roles: ['super_admin', 'admin', 'employee'] },
  { name: 'Transactions', path: '/transactions', icon: CreditCard, roles: ['super_admin', 'admin', 'employee'] },
  { name: 'KYC Verification', path: '/kyc', icon: FileCheck, roles: ['super_admin', 'employee'] },
  { name: 'Subscriptions', path: '/subscriptions', icon: Crown, roles: ['super_admin', 'admin'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['super_admin', 'admin'] },
];

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Filter navigation items based on user role
  const filteredNavItems = useMemo(() => {
    if (!user) return []; // or return a default set
    const userRole = user.role; // e.g., 'super_admin', 'admin', 'employee'
    return navItems.filter(item => item.roles.includes(userRole));
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:transform hover:scale-[1.02]'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className={`h-5 w-5 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.username || user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'guest'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {location.pathname.slice(1) || 'dashboard'}
            </h1>
            <div className="flex items-center space-x-4" onClick={() => navigate('/settings')}>
              <div className="relative">
                <User2 className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Layout;