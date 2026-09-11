import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import CorporatePage from './pages/CorporatePage';
import CustomersPage from './pages/CustomersPage';
import TransactionsPage from './pages/TransactionsPage';
import StockPage from './pages/StockPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import KYCPage from './pages/KYCPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import SuppliersPage from './pages/SupplierPage';
import EmployeesPage from './pages/EmployeePage';
import Forbidden from './pages/Forbidden';
import ProtectedRoute from './components/ProtectedRoute'; // 👈 import the new component

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/forbidden" element={<Forbidden />} />            
             <Route path="/dashboard" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/corporate" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <CorporatePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <CustomersPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <SuppliersPage/>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/employee" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN]}>
                <Layout>
                  <EmployeesPage/>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <TransactionsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/stock" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <StockPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/kyc" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <KYCPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/subscriptions" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <SubscriptionsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;