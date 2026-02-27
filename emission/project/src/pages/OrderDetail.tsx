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

    const getItems = () => {
        try {
            if (!order.items) return [];
            return typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        } catch (e) {
            console.error('Error parsing items', e);
            return [];
        }
    };
    const items = getItems();
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans print:bg-white print:p-0">
            {/* Global Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    header, footer, nav, button, .no-print { display: none !important; }
                    .print-header { display: flex !important; margin-bottom: 2rem; border-bottom: 2px solid #000; padding-bottom: 1rem; }
                    .print-container { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
                    .print-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
                    body { background: white !important; color: black !important; }
                    .text-gray-400 { color: #666 !important; }
                    .text-gray-300 { color: #999 !important; }
                    .bg-gray-50 { background: #f9f9f9 !important; }
                }
            `}} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print-container">
                {/* Print Header (Only visible on print) */}
                <div className="hidden print-header flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">EMISSION</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium Sportswear & Medical Wear</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black uppercase">Tax Invoice</p>
                        <p className="text-[10px] font-bold text-gray-400">Date: {date.split(',')[0]}</p>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('orders')}
                    className="flex items-center gap-2 text-gray-400 hover:text-black transition mb-8 group no-print"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to History</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 print:mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-black uppercase tracking-tight print:text-xl">Order #{order.id.split('-')[0].toUpperCase()}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest print:border print:border-gray-200 ${order.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            Placed on {date}
                        </p>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition shadow-xl shadow-black/10 no-print"
                    >
                        <Download className="w-4 h-4" />
                        Print / Download Invoice
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
                    {/* Items Section */}
                    <div className="lg:col-span-2 space-y-6 print:space-y-4">
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm print-card print:border-b print:border-gray-100 print:rounded-none">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 print:mb-4">Items Summary</h3>
                            <div className="space-y-6 print:space-y-4">
                                {items.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0 print:pb-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 print:hidden">
                                            <Package className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-black uppercase tracking-tight mb-2">{item.name || 'Product'}</p>

                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</p>
                                                {item.size && (
                                                    <p className="text-[10px] font-black text-black uppercase tracking-widest">Size: {item.size}</p>
                                                )}
                                                {item.color && (
                                                    <p className="text-[10px] font-black text-black uppercase tracking-widest">Color: {item.color}</p>
                                                )}
                                            </div>

                                            {item.embroidery && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Customization</p>
                                                    <p className="text-[10px] font-bold text-black font-serif italic">"{item.embroidery.text}"</p>
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Position: {item.embroidery.position}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-black">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                                            <p className="text-[10px] font-bold text-gray-400">₹{Number(item.price).toLocaleString()} / unit</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Timeline (Only visible on screen) */}
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm no-print">
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
                    <div className="space-y-8 print:mt-8 print:space-y-4">
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm print-card print:border-none">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 print:mb-4">Payment Summary</h3>
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
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 print:hidden">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Method</p>
                                    <p className="text-xs font-black text-black uppercase tracking-tight">Razorpay Online</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm print-card">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 print:mb-2">Delivery Address</h3>
                            <div className="flex gap-4">
                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 print:hidden" />
                                <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-tight">
                                    {order.shippingAddress}
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-600 rounded-[32px] p-8 shadow-xl shadow-blue-500/20 text-white no-print">
                            <Clock className="w-8 h-8 mb-4 opacity-50" />
                            <h4 className="font-black uppercase tracking-tight mb-2">Need Updates?</h4>
                            <p className="text-[10px] font-medium text-blue-100 leading-relaxed mb-6">
                                If you have any questions about this order, our priority support team is ready to assist you.
                            </p>
                            <button onClick={() => onNavigate('contact')} className="w-full bg-white text-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition">
                                Contact Support
                            </button>
                        </div>

                        <div className="hidden print:block text-center mt-12 pt-8 border-t border-gray-100">
                            <p className="text-[10px] font-black uppercase text-gray-400">Thank you for choosing Emission</p>
                            <p className="text-[8px] font-medium text-gray-300 mt-1">This is a system generated invoice.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
