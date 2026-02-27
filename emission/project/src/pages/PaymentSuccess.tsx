import { CheckCircle2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { PageType } from '../types';

interface PaymentSuccessProps {
    onNavigate: (page: PageType) => void;
}

export default function PaymentSuccess({ onNavigate }: PaymentSuccessProps) {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 flex items-center justify-center px-4">
            <div className="max-w-xl w-full text-center">
                <div className="relative inline-block mb-10">
                    <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-ping opacity-25"></div>
                    <div className="relative bg-green-500 text-white p-6 rounded-full shadow-2xl">
                        <CheckCircle2 className="w-16 h-16" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tight">
                    Order Placed Successfully!
                </h1>

                <p className="text-gray-500 text-lg mb-12 leading-relaxed">
                    Thank you for choosing Emission. Your order has been confirmed and is being processed.
                    We'll notify you once your items are on their way.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => onNavigate('orders')}
                        className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-xl active:scale-95"
                    >
                        <Package className="w-5 h-5" />
                        Track My Order
                    </button>
                    <button
                        onClick={() => onNavigate('products')}
                        className="flex items-center justify-center gap-2 bg-gray-50 text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-sm active:scale-95 group"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Continue Shopping
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400">
                        Need help with your order? <button onClick={() => onNavigate('contact')} className="text-black font-bold hover:underline">Contact Support</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
