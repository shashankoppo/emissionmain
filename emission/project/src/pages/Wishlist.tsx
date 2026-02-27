import { Trash2, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { PageType, Product } from '../types';
import { useState, useEffect } from 'react';
import { productAPI } from '../lib/api';

interface WishlistProps {
    onNavigate: (page: PageType, param?: string) => void;
    wishlist: string[];
    onToggleWishlist: (productId: string) => void;
    onAddToCart: (productId: string, quantity: number, size?: string, color?: string) => void;
}

export default function Wishlist({ onNavigate, wishlist, onToggleWishlist, onAddToCart }: WishlistProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (wishlist.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const allProducts = await productAPI.getAll();
                const filtered = allProducts.filter(p => wishlist.includes(p.id));
                setProducts(filtered);
            } catch (err) {
                console.error('Failed to fetch wishlist products', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlist]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-black mb-2 tracking-tight">Your Wishlist</h1>
                        <p className="text-gray-500 font-medium">Items you've saved for later.</p>
                    </div>
                    <button
                        onClick={() => onNavigate('products')}
                        className="group flex items-center gap-2 text-sm font-bold text-black hover:opacity-70 transition"
                    >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-20 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Save your favorite items to keep track of them and buy them later.
                        </p>
                        <button
                            onClick={() => onNavigate('products')}
                            className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-xl active:scale-95"
                        >
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <button
                                        onClick={() => onToggleWishlist(product.id)}
                                        className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                                            {product.category === 'sportswear' ? 'Performance' : 'Medical Grade'}
                                        </p>
                                        <h3 className="text-xl font-bold text-black line-clamp-1">{product.name}</h3>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-8">
                                        <span className="text-2xl font-black text-black">
                                            ₹{(product.retailPrice || product.price).toLocaleString()}
                                        </span>
                                        {product.retailPrice && product.retailPrice < product.price && (
                                            <span className="text-sm text-gray-400 line-through">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <button
                                            onClick={() => onNavigate('product-detail', product.id)}
                                            className="flex-1 py-4 px-4 bg-gray-50 text-black rounded-2xl font-bold text-sm hover:bg-gray-100 transition shadow-sm active:scale-95"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => {
                                                const size = product.availableSizes?.[0];
                                                const color = product.availableColors?.[0];
                                                onAddToCart(product.id, 1, size, color);
                                            }}
                                            className="flex-[1.5] py-4 px-4 bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition shadow-xl active:scale-95"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
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
