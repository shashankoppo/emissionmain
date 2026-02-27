import { ArrowLeft, Package, MapPin, CreditCard, Download, Calendar, Truck, Clock } from 'lucide-react';
import { PageType } from '../types';
import { useState, useEffect } from 'react';
import { customerAPI } from '../lib/api';

interface OrderDetailProps {
    orderId: string;
    onNavigate: (page: PageType) => void;
}

export default function OrderDetail({ orderId, onNavigate }: OrderDetailProps) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const orders = await customerAPI.getOrders();
            const found = orders.find((o: any) => o.id === orderId);
            setOrder(found);
        } catch (err) {
            console.error('Failed to fetch order details:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Package className="w-16 h-16 text-gray-200 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
                <button onClick={() => onNavigate('orders')} className="mt-4 text-black font-bold uppercase text-xs tracking-widest hover:underline">Back to Orders</button>
            </div>
        );
    }

    const items = JSON.parse(order.items || '[]');
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <button
                    onClick={() => onNavigate('orders')}
                    className="flex items-center gap-2 text-gray-400 hover:text-black transition mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to History</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-black uppercase tracking-tight">Order #{order.id.split('-')[0].toUpperCase()}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Placed on {date}
                        </p>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition shadow-xl shadow-black/10"
                    >
                        <Download className="w-4 h-4" />
                        Download Invoice
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">Items Selected</h3>
                            <div className="space-y-6">
                                {items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                                            <Package className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-black uppercase tracking-tight mb-1">{item.name || 'Product'}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-black">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Timeline (Mock for now) */}
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">Status Updates</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-black uppercase tracking-tight">Order Confirmed</p>
                                        <p className="text-xs text-gray-400 mt-1">We have received your payment and are processing the items.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="space-y-8">
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">Payment Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                                    <span>Subtotal</span>
                                    <span className="text-black">₹{Number(order.totalAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                                    <span>Shipping</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between">
                                    <span className="text-[10px] font-black text-black uppercase tracking-widest">Total Paid</span>
                                    <span className="text-xl font-black text-black tracking-tight">₹{Number(order.totalAmount).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Method</p>
                                    <p className="text-xs font-black text-black uppercase tracking-tight">Razorpay Online</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Delivery Address</h3>
                            <div className="flex gap-4">
                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-tight">
                                    {order.shippingAddress}
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-600 rounded-[32px] p-8 shadow-xl shadow-blue-500/20 text-white">
                            <Clock className="w-8 h-8 mb-4 opacity-50" />
                            <h4 className="font-black uppercase tracking-tight mb-2">Need Updates?</h4>
                            <p className="text-[10px] font-medium text-blue-100 leading-relaxed mb-6">
                                If you have any questions about this order, our priority support team is ready to assist you.
                            </p>
                            <button onClick={() => onNavigate('contact')} className="w-full bg-white text-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
