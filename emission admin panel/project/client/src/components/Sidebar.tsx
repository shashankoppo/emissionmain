import { Package, MessageSquare, ShoppingCart, LogOut, LayoutDashboard, Settings as SettingsIcon, FileText, Zap, Truck, Image as ImageIcon, LayoutGrid, Palette, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/products', icon: Package, label: 'Products' },
    { href: '/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/invoices', icon: FileText, label: 'Invoices' },
    { href: '/pos', icon: Zap, label: 'POS Terminal' },
    { href: '/courier', icon: Truck, label: 'Delivery' },
    { href: '/banners', icon: ImageIcon, label: 'Hero Banners' },
    { href: '/collections', icon: LayoutGrid, label: 'Masterpieces' },
    { href: '/enquiries', icon: MessageSquare, label: 'Enquiries' },
    { href: '/invoice-design', icon: Palette, label: 'Invoice Design' },
    { href: '/coupons', icon: Tag, label: 'Promotions' },
    { href: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Emission</h1>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${isActive(item.href)
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
              }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 w-full transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
