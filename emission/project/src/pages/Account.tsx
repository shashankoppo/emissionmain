import { Package, MapPin, LogOut, Settings, CreditCard, Loader2 } from 'lucide-react';
import { PageType } from '../types';
import { useState, useEffect } from 'react';
import { customerAPI } from '../lib/api';

interface AccountProps {
  onNavigate: (page: PageType, param?: string) => void;
  customer: { id: string; name: string; email: string; phone?: string } | null;
}

export default function Account({ onNavigate, customer }: AccountProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customer) {
      fetchOrders();
    }
  }, [customer]);

  const fetchOrders = async () => {
    try {
      const data = await customerAPI.getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch account orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const user = {
    name: customer?.name || 'Customer',
    email: customer?.email || '',
    phone: customer?.phone || 'No phone provided',
    address: 'Address not set',
    memberSince: 'Member',
  };

  const recentOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Hello, {user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between">
              <div className="text-center flex-1 border-r border-gray-100">
                <p className="text-2xl font-bold text-black">{orders.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Orders</p>
              </div>
              <div className="text-center flex-1 border-r border-gray-100">
                <p className="text-2xl font-bold text-black">{orders.filter(o => o.status === 'returned').length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Returns</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-black">0</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Wishlist</p>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-black">Recent Orders</h2>
                <button
                  onClick={() => onNavigate('orders')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-black animate-spin" />
                  </div>
                ) : recentOrder ? (
                  <div
                    onClick={() => onNavigate('orders')}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-black/10 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                        <Package className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">Order #{recentOrder.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{new Date(recentOrder.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-black">₹{Number(recentOrder.totalAmount).toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${recentOrder.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                        {recentOrder.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No orders yet</p>
                    <button
                      onClick={() => onNavigate('products')}
                      className="text-blue-600 font-bold text-sm mt-2 hover:underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Menu */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Account Menu</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => onNavigate('orders')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </button>
                <button
                  onClick={() => { }} // Placeholder
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
                >
                  <MapPin className="w-4 h-4" />
                  Saved Addresses
                </button>
                <button
                  onClick={() => { }} // Placeholder
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
                >
                  <CreditCard className="w-4 h-4" />
                  Payment Methods
                </button>
                <button
                  onClick={() => { }} // Placeholder
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="my-2 border-t border-gray-100" />
                <button
                  onClick={() => onNavigate('home')} // Should logout in real app
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Need Help? */}
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-xs text-blue-700 mb-4">
                Have questions about your order or account? Our support team is here to help.
              </p>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
