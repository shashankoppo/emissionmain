import { useState } from 'react';
import { Package, Eye, Truck, ChevronRight, ShoppingBag } from 'lucide-react';
import { PageType } from '../types';

interface OrdersProps {
    onNavigate: (page: PageType, param?: string) => void;
    isLoggedIn: boolean;
}

interface MockOrder {
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    itemCount: number;
    firstItemName: string;
}

export default function Orders({ onNavigate, isLoggedIn }: OrdersProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered'>('all');

    // Demo orders for UI preview
    const demoOrders: MockOrder[] = [];

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
            confirmed: 'bg-blue-50 text-blue-700',
            processing: 'bg-yellow-50 text-yellow-700',
            shipped: 'bg-indigo-50 text-indigo-700',
            delivered: 'bg-green-50 text-green-700',
            cancelled: 'bg-red-50 text-red-700',
        };
        return styles[status] || 'bg-gray-50 text-gray-700';
    };

    const filtered = demoOrders.filter((order) => {
        if (activeTab === 'active') return ['confirmed', 'processing', 'shipped'].includes(order.status);
        if (activeTab === 'delivered') return order.status === 'delivered';
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black">My Orders</h1>
                        <p className="text-gray-500 mt-1">Manage and track all your orders</p>
                    </div>
                    <button
                        onClick={() => onNavigate('track-order')}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-900 transition"
                    >
                        <Truck className="w-4 h-4" />
                        Track Order
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 max-w-sm">
                    {(['all', 'active', 'delivered'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filtered.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-black mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                        <button
                            onClick={() => onNavigate('products')}
                            className="bg-black text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => onNavigate('order-detail', order.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-bold text-black">{order.orderNumber}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-black truncate">{order.firstItemName}</p>
                                        {order.itemCount > 1 && (
                                            <p className="text-xs text-gray-500">+ {order.itemCount - 1} more item{order.itemCount > 2 ? 's' : ''}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-bold text-black">₹{order.total.toLocaleString()}</p>
                                    <div className="flex items-center gap-2">
                                        {order.status === 'shipped' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNavigate('track-order');
                                                }}
                                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                                            >
                                                <Truck className="w-3 h-3" />
                                                Track
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNavigate('order-detail', order.id);
                                            }}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View Details
                                            <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
