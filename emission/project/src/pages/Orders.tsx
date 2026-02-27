import { useState, useEffect } from 'react';
import { Package, Truck, ChevronRight, ShoppingBag, Loader2, X } from 'lucide-react';
import { PageType } from '../types';
import { customerAPI } from '../lib/api';

interface OrdersProps {
    onNavigate: (page: PageType, param?: string) => void;
    isLoggedIn: boolean;
}

export default function Orders({ onNavigate, isLoggedIn }: OrdersProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered'>('all');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchOrders();
        }
    }, [isLoggedIn]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await customerAPI.getOrders();
            setOrders(data);
        } catch (err: any) {
            console.error('Failed to fetch orders:', err);
            setError('Could not load your orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-black mb-3">Sign in to view orders</h1>
                    <p className="text-gray-500 mb-8">
                        Log in to your account to view your order history, track shipments, and manage returns.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => onNavigate('login')}
                            className="bg-black text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => onNavigate('track-order')}
                            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                        >
                            Track Order
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            paid: 'bg-green-50 text-green-700',
            pending: 'bg-yellow-50 text-yellow-700',
            shipped: 'bg-indigo-50 text-indigo-700',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-50 text-red-700',
        };
        return styles[status] || 'bg-gray-50 text-gray-700';
    };

    const filtered = orders.filter((order) => {
        if (activeTab === 'active') return ['paid', 'pending', 'shipped'].includes(order.status);
        if (activeTab === 'delivered') return order.status === 'delivered';
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-black animate-spin" />
                    <p className="text-gray-500 font-medium">Fetching your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-sm max-w-sm w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-black mb-2">Oops!</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-black uppercase tracking-tight">Order History</h1>
                        <p className="text-gray-400 mt-2 font-medium">Every performance piece tells a story.</p>
                    </div>
                    <button
                        onClick={() => onNavigate('track-order')}
                        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition shadow-xl shadow-black/10"
                    >
                        <Truck className="w-4 h-4" />
                        Track Package
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-[20px] mb-10 max-w-md">
                    {(['all', 'active', 'delivered'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-XV transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filtered.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-[32px] p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-black mb-3 uppercase tracking-tight">No collection yet</h3>
                        <p className="text-gray-400 mb-10 max-w-xs mx-auto text-sm leading-relaxed">Your journey begins with your first order. Explore our premium collection now.</p>
                        <button
                            onClick={() => onNavigate('products')}
                            className="bg-black text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition shadow-lg shadow-black/5"
                        >
                            Explore Collection
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filtered.map((order) => {
                            const items = JSON.parse(order.items || '[]');
                            const firstItem = items[0] || { productId: 'Unknown' };
                            const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            });

                            return (
                                <div
                                    key={order.id}
                                    className="group bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all cursor-pointer relative overflow-hidden"
                                    onClick={() => onNavigate('order-detail', order.id)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Receipt ID</p>
                                            <p className="text-sm font-black text-black uppercase tracking-tight">{order.id.split('-')[0]}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Purchased On</p>
                                                <p className="text-sm font-black text-black uppercase tracking-tight">{date}</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[24px] mb-8 border border-gray-100">
                                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                                            <Package className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Items</p>
                                            <p className="text-sm font-black text-black truncate uppercase tracking-tight">
                                                {firstItem.name || 'Product'}
                                                {firstItem.size ? ` (${firstItem.size})` : ''}
                                            </p>
                                            {items.length > 1 && (
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">+ {items.length - 1} Additional Item{items.length > 2 ? 's' : ''}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="text-2xl font-black text-black tracking-tight">₹{Number(order.totalAmount).toLocaleString()}</p>
                                        </div>
                                        <button
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black group-hover:gap-4 transition-all"
                                        >
                                            View Statement
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
