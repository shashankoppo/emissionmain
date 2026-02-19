
import { X, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { PageType, CartItem } from '../../types';

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
    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.product?.retailPrice || item.product?.price || 1999;
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
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white h-full shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col transform transition-transform duration-500 ease-out">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-50">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            YOUR CART
                            <span className="bg-black text-white text-[10px] font-black px-2 py-1 rounded-full">{cartItems.length}</span>
                        </h2>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Free shipping on all orders</p>
                    </div>
                    <button
                        onClick={onClose}
                        title="Close Cart"
                        className="p-3 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
                    >
                        <X className="w-5 h-5 text-black" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center animate-pulse">
                                <ShoppingBag className="w-10 h-10 text-gray-200" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-black mb-2">Cart is empty</h3>
                                <p className="text-gray-400 text-sm max-w-[200px] mx-auto leading-relaxed">Looks like you haven't added any masterpieces yet.</p>
                            </div>
                            <button
                                onClick={() => { onClose(); onNavigate('products'); }}
                                className="px-10 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 transition"
                            >
                                Start Browsing
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div key={`${item.productId}-${idx}`} className="flex gap-6 group">
                                <div className="w-28 h-36 bg-gray-50 rounded-[24px] flex-shrink-0 overflow-hidden border border-gray-50 relative">
                                    <img
                                        src={item.product?.images?.[0] || item.product?.image || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80"}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <button
                                        onClick={() => handleRemoveItem(item.productId)}
                                        title="Remove item"
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-black text-sm text-black uppercase tracking-tight line-clamp-2">
                                                {item.product?.name}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {item.selectedSize && (
                                                <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded-md">Size: {item.selectedSize}</span>
                                            )}
                                            {item.selectedColor && (
                                                <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded-md">Color: {item.selectedColor}</span>
                                            )}
                                        </div>
                                        {item.embroidery && (
                                            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-2 flex items-center gap-1">
                                                <Sparkles className="w-2 h-2" /> Customized
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                                aria-label="Decrease quantity"
                                                className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-400 hover:text-black"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                                aria-label="Increase quantity"
                                                className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-400 hover:text-black"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-black text-black">
                                            ₹{((item.product?.retailPrice || item.product?.price || 1999) * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-8 border-t border-gray-50 space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="font-black">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                                <span className="text-blue-600 font-black tracking-widest text-[10px] uppercase">Complimentary</span>
                            </div>
                            <div className="pt-4 flex justify-between items-center border-t border-gray-50">
                                <span className="text-black font-black uppercase tracking-widest text-xs">Total Due</span>
                                <span className="text-2xl font-black">₹{subtotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl">
                                <ShieldCheck className="w-4 h-4 text-gray-400 mb-1" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Secure</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl">
                                <Truck className="w-4 h-4 text-gray-400 mb-1" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Express</span>
                            </div>
                        </div>

                        <button
                            onClick={() => { onClose(); onCheckout(); }}
                            className="w-full bg-black text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-black/10 active:scale-95"
                        >
                            Complete Order
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
