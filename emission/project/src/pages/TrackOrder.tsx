import { useState } from 'react';
import { Search, Package, Truck, MapPin, CheckCircle, Clock, ArrowRight, Phone } from 'lucide-react';
import { PageType } from '../types';

interface TrackOrderProps {
    onNavigate: (page: PageType) => void;
}

interface TrackingResult {
    orderNumber: string;
    status: 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';
    items: { name: string; qty: number; image?: string }[];
    trackingId?: string;
    estimatedDelivery: string;
    shippingAddress: string;
    timeline: { status: string; date: string; description: string; completed: boolean }[];
}

export default function TrackOrder({ onNavigate }: TrackOrderProps) {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TrackingResult | null>(null);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) {
            setError('Please enter your order ID.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        // In production, this would call your backend
        setTimeout(() => {
            setError('Order details not found. Please verify your order ID.');
            setLoading(false);
        }, 1500);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'text-green-600 bg-green-50';
            case 'shipped': return 'text-blue-600 bg-blue-50';
            case 'out-for-delivery': return 'text-orange-600 bg-orange-50';
            case 'processing': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-black text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
                        <Package className="w-4 h-4" />
                        Order Tracking
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Track your order</h1>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        Enter your order ID to get real-time updates on your shipment status.
                    </p>
                </div>
            </div>

            {/* Track Form */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Order ID / Number</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g., EM-2026021400001"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email address (optional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email used during order"
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>
                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Track Order
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Order Summary */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order</p>
                                <p className="text-lg font-bold text-black">#{result.orderNumber}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusColor(result.status)}`}>
                                {result.status.replace('-', ' ')}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            {result.trackingId && (
                                <div>
                                    <p className="text-xs text-gray-500">Tracking ID</p>
                                    <p className="text-sm font-medium text-black">{result.trackingId}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-500">Estimated Delivery</p>
                                <p className="text-sm font-medium text-black">{result.estimatedDelivery}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Shipping To</p>
                                <p className="text-sm font-medium text-black">{result.shippingAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Items in this order</h3>
                        <div className="space-y-3">
                            {result.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-black">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-6">Shipment Timeline</h3>
                        <div className="relative">
                            {result.timeline.map((step, index) => (
                                <div key={index} className="flex gap-4 pb-8 last:pb-0 relative">
                                    {/* Line */}
                                    {index < result.timeline.length - 1 && (
                                        <div className={`absolute left-[15px] top-8 w-0.5 h-full ${step.completed ? 'bg-black' : 'bg-gray-200'}`} />
                                    )}
                                    {/* Dot */}
                                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                                        }`}>
                                        {step.completed ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : index === 3 ? (
                                            <Truck className="w-4 h-4" />
                                        ) : index === 4 ? (
                                            <MapPin className="w-4 h-4" />
                                        ) : (
                                            <Clock className="w-4 h-4" />
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <p className={`text-sm font-semibold ${step.completed ? 'text-black' : 'text-gray-400'}`}>
                                            {step.status}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                                        <p className={`text-xs mt-1 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Help */}
                    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                        <p className="text-sm text-gray-600 mb-3">Need help with your order?</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => onNavigate('contact')}
                                className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-900 transition"
                            >
                                <Phone className="w-4 h-4" />
                                Contact Support
                            </button>
                            <a
                                href="https://wa.me/91XXXXXXXXXX"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition"
                            >
                                WhatsApp Us
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* No result section */}
            {!result && !loading && (
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gray-50 rounded-2xl">
                            <Package className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-sm font-semibold text-black mb-1">Order Confirmed</h3>
                            <p className="text-xs text-gray-500">We've received your order and payment.</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-2xl">
                            <Truck className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-sm font-semibold text-black mb-1">Shipped</h3>
                            <p className="text-xs text-gray-500">Your order is packed and on its way.</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-2xl">
                            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-sm font-semibold text-black mb-1">Delivered</h3>
                            <p className="text-xs text-gray-500">Your order has arrived at your doorstep.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
