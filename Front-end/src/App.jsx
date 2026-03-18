import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ... (rest of imports)

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
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
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
