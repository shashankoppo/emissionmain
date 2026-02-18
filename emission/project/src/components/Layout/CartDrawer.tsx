import { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { PageType, CartItem } from '../../types';
import Button from '../UI/Button';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateCart: (items: CartItem[]) => void;
    onCheckout: () => void;
    onNavigate: (page: PageType, id?: string) => void;
}

export default function CartDrawer({
    isOpen,
    onClose,
    cartItems,
    onUpdateCart,
    onCheckout,
    onNavigate
}: CartDrawerProps) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Calculate total
        // Note: In a real app we'd fetch full product details. 
        // For this demo we'll assume product details are embedded or fetched elsewhere.
        // Since we don't have full product data in CartItem in App.tsx state yet, 
        // we might need to rely on a mock calculation or updated types.
        // For now, let's assume we have price access or fetch it.
        // To keep it simple and fast, I'll calculate based on a mock price if missing, 
        // but ideally we should pass full product objects.

        // As a temporary fix for visual preview, let's assume a standard price
        // or that CartItem has been updated to include 'product' snapshot.
    }, [cartItems]);

    // Determine subtotal (mock logic for display if price missing, else real)
    const subtotal = cartItems.reduce((acc, item) => {
        // Fallback price 1999 if not present (just for UI demo)
        const price = (item as any).product?.price || (item as any).price || 1999;
        return acc + (price * item.quantity);
    }, 0);

    const handleUpdateQuantity = (productId: string, newQty: number) => {
        if (newQty < 1) {
            handleRemoveItem(productId);
            return;
        }
        const updated = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQty } : item
        );
        onUpdateCart(updated);
    };

    const handleRemoveItem = (productId: string) => {
        const updated = cartItems.filter(item => item.productId !== productId);
        onUpdateCart(updated);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Shopping Cart <span className="text-gray-400 text-sm font-normal">({cartItems.length})</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                            <ShoppingBag className="w-16 h-16 text-gray-200" />
                            <p className="text-lg font-medium text-black">Your cart is empty</p>
                            <p className="text-sm max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
                            <button
                                onClick={() => { onClose(); onNavigate('products'); }}
                                className="mt-4 px-6 py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div key={`${item.productId}-${idx}`} className="flex gap-4">
                                {/* Image Placeholder */}
                                <div className="w-24 h-28 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                                    <img
                                        src={(item as any).product?.image || (item as any).image || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80"}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-black line-clamp-2 pr-4">
                                                {(item as any).product?.name || "Premium Sportswear Item"}
                                            </h3>
                                            <button
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {(item as any).selectedSize && (
                                            <p className="text-xs text-gray-500 mt-1">Size: {(item as any).selectedSize} • Color: {(item as any).selectedColor || 'Default'}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                                className="p-1.5 hover:bg-gray-50 text-gray-500"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                                className="p-1.5 hover:bg-gray-50 text-black"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-black">
                                            ₹{(((item as any).product?.price || 1999) * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Cross Sell / Upsell could go here */}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-semibold text-green-600">Free</span>
                            </div>
                        </div>

                        <button
                            onClick={() => { onClose(); onCheckout(); }}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition shadow-xl shadow-black/10"
                        >
                            Checkout • ₹{subtotal.toLocaleString('en-IN')}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-3">
                            Secure checkout powered by Razorpay. 100% money-back guarantee.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
