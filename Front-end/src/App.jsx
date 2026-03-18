import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Orders = lazy(() => import('./pages/Orders'));
const Customers = lazy(() => import('./pages/Customers'));
const Finance = lazy(() => import('./pages/Finance'));
const Docs = lazy(() => import('./pages/Docs'));
const Profile = lazy(() => import('./pages/Profile'));
const Support = lazy(() => import('./pages/Support'));
const Catalog = lazy(() => import('./pages/Catalog'));
const AccountStatement = lazy(() => import('./pages/AccountStatement'));
const MySales = lazy(() => import('./pages/MySales'));
const RH = lazy(() => import('./pages/RH/RH.jsx'));

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="p-5 text-center text-muted"><i className="fas fa-spinner fa-spin me-2"></i>Cargando módulos...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/rh" element={<RH />} />
                <Route path="/my-sales" element={<MySales />} /> 
                <Route path="/client-orders" element={<Orders />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/account-statement" element={<AccountStatement />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/support" element={<Support />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
