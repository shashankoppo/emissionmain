import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Enquiries from './pages/Enquiries';
import Orders from './pages/Orders';
import Sidebar from './components/Sidebar';

import Settings from './pages/Settings';
import Courier from './pages/Courier';
import Invoices from './pages/Invoices';
import POS from './pages/POS';
import BannerManagement from './pages/Banners';
import CollectionManagement from './pages/Collections';

function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/courier" element={<Courier />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/banners" element={<BannerManagement />} />
          <Route path="/collections" element={<CollectionManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
