import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Package, MessageSquare, ShoppingCart, TrendingUp } from 'lucide-react';

interface Stats {
  products: number;
  enquiries: number;
  orders: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    enquiries: 0,
    orders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, enquiriesRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/enquiries'),
        api.get('/orders'),
      ]);

      const totalRevenue = ordersRes.data.reduce(
        (sum: number, order: any) => sum + parseFloat(order.totalAmount),
        0
      );

      setStats({
        products: productsRes.data.length,
        enquiries: enquiriesRes.data.length,
        orders: ordersRes.data.length,
        totalRevenue,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Enquiries',
      value: stats.enquiries,
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-orange-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Emission Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <Package className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Products</h3>
            <p className="text-sm text-gray-600 mt-1">Add or edit product catalog</p>
          </a>
          <a
            href="/admin/enquiries"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
          >
            <MessageSquare className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">View Enquiries</h3>
            <p className="text-sm text-gray-600 mt-1">Respond to customer requests</p>
          </a>
          <a
            href="/admin/orders"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition"
          >
            <ShoppingCart className="w-6 h-6 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Process Orders</h3>
            <p className="text-sm text-gray-600 mt-1">Track and fulfill orders</p>
          </a>
        </div>
      </div>
    </div>
  );
}
