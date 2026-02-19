import { useState, useEffect } from 'react';
import api from '../lib/api';
import { ShoppingCart, Package, Truck, CheckCircle, Clock, XCircle, Search, Filter, MoreVertical, Calendar, Download, ExternalLink } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  source: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o =>
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Orders</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and track your customer shipments</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-3 bg-gray-50 text-gray-900 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm active:scale-95">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-16 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
            />
          </div>
          <div className="flex gap-4">
            <button title="Filter" className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"><Filter className="w-5 h-5" /></button>
            <button title="Options" className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status / Source</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8"><div className="h-4 bg-gray-50 rounded-full w-full"></div></td>
                  </tr>
                ))
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-8">
                    <span className="text-sm font-black text-black font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900">{order.customerName}</span>
                      <span className="text-xs font-bold text-gray-400">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-tighter">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="text-base font-black text-black tracking-tighter">₹{Number(order.totalAmount).toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                      <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">{order.source || 'Website'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-gray-50 border-none rounded-xl py-2 px-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-black/5 outline-none transition"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button title="View Details" className="p-3 bg-white border border-gray-100 text-gray-900 rounded-xl hover:bg-black hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="py-24 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
