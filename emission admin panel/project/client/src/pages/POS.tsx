import { useState, useEffect, useMemo } from 'react';
import api from '../lib/api';
import { ShoppingCart, Search, Plus, Minus, Trash2, User, Phone, CreditCard, Receipt, Zap, Check, Printer, Palette, XCircle } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    retailPrice: number;
    price: number;
    images: string;
    inStock: boolean;
    category: string;
}

interface CartItem {
    product: Product;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    hasEmbroidery: boolean;
    embroideryText?: string;
}

export default function POS() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<any>(null);
    const [embroideryPrice, setEmbroideryPrice] = useState(250);

    useEffect(() => {
        fetchProducts();
        fetchSettings();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            if (response.data.EMBROIDERY_PRICE) {
                setEmbroideryPrice(Number(response.data.EMBROIDERY_PRICE));
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.inStock
        );
    }, [products, searchQuery]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1, hasEmbroidery: false }];
        });
    };

    const toggleEmbroidery = (productId: string) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                return { ...item, hasEmbroidery: !item.hasEmbroidery };
            }
            return item;
        }));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const total = useMemo(() => {
        return cart.reduce((sum, item) => {
            const basePrice = Number(item.product.retailPrice || item.product.price);
            const customizationPrice = item.hasEmbroidery ? embroideryPrice : 0;
            return sum + (basePrice + customizationPrice) * item.quantity;
        }, 0);
    }, [cart, embroideryPrice]);

    const handleCheckout = async (paymentMethod: 'cash' | 'card' | 'upi') => {
        if (cart.length === 0) return;
        if (!customerInfo.name || !customerInfo.phone) {
            alert('Please enter customer name and phone');
            return;
        }

        setProcessing(true);
        try {
            const orderData = {
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                customerPhone: customerInfo.phone,
                shippingAddress: customerInfo.address || 'In-Store POS',
                totalAmount: total,
                status: 'completed',
                paymentMethod,
                source: 'pos',
                items: cart.map(item => ({
                    productId: item.product.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: Number(item.product.retailPrice || item.product.price) + (item.hasEmbroidery ? embroideryPrice : 0),
                    hasEmbroidery: item.hasEmbroidery
                }))
            };

            const response = await api.post('/orders', orderData);
            setOrderSuccess(response.data);
            setCart([]);
            setCustomerInfo({ name: '', phone: '', email: '', address: '' });
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Order processing failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const printInvoice = () => {
        if (!orderSuccess) return;

        const printContent = document.getElementById('invoice-print-area');
        if (!printContent) return;

        const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!winPrint) return;

        winPrint.document.write(`
            <html>
                <head>
                    <title>Invoice - ${orderSuccess.id}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; }
                        .header { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 30px; margin-bottom: 30px; }
                        .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
                        .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 40px; }
                        .meta-block h4 { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                        .meta-block p { font-weight: 700; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; }
                        th { text-align: left; padding: 15px; background: #f9f9f9; font-size: 11px; text-transform: uppercase; color: #666; }
                        td { padding: 15px; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600; }
                        .total-row { background: #1a1a1a; color: white; }
                        .total-row td { border: none; font-size: 18px; font-weight: 900; }
                        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">EMISSION</div>
                        <p style="font-size: 12px; margin-top: 5px;">Premium Corporate & Medical Apparel</p>
                    </div>
                    <div class="invoice-meta">
                        <div class="meta-block">
                            <h4>Customer</h4>
                            <p>${orderSuccess.customerName}</p>
                            <p>${orderSuccess.customerPhone}</p>
                        </div>
                        <div class="meta-block" style="text-align: right;">
                            <h4>Order ID</h4>
                            <p>#${orderSuccess.id.slice(0, 8).toUpperCase()}</p>
                            <h4>Date</h4>
                            <p>${new Date(orderSuccess.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Price</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${JSON.parse(orderSuccess.items).map((item: any) => `
                                <tr>
                                    <td>
                                        ${item.name}
                                        ${item.hasEmbroidery ? '<br><span style="font-size: 10px; color: #666;">+ Custom Embroidery</span>' : ''}
                                    </td>
                                    <td style="text-align: center;">${item.quantity}</td>
                                    <td style="text-align: right;">₹${item.price.toLocaleString()}</td>
                                    <td style="text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td colspan="3">Grand Total</td>
                                <td style="text-align: right;">₹${Number(orderSuccess.totalAmount).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="footer">
                        <p>Thank you for shopping at EMISSION!</p>
                        <p>This is a computer-generated invoice and doesn't require a physical signature.</p>
                    </div>
                </body>
            </html>
        `);
        winPrint.document.close();
        winPrint.focus();
        winPrint.print();
        winPrint.close();
    };

    return (
        <div className="h-[calc(100vh-100px)] flex gap-8 overflow-hidden">
            {/* Products Gallery */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Point of Sale</h1>
                        <p className="text-gray-400 text-sm font-medium">Create direct orders for walk-in customers</p>
                    </div>
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pr-4 scrollbar-hide">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="bg-gray-50 animate-pulse rounded-[32px] h-64"></div>
                        ))
                    ) : filteredProducts.map(product => {
                        const images = JSON.parse(product.images || '[]');
                        return (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white rounded-[32px] border border-gray-100 p-5 group cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden mb-4 relative">
                                    <img src={images[0] || 'https://via.placeholder.com/300x400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate mb-1">{product.name}</h3>
                                <p className="text-lg font-black text-blue-600 tracking-tighter">₹{(Number(product.retailPrice || product.price)).toLocaleString()}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Terminal / Cart Summary */}
            <div className="w-[450px] bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-6 h-6 text-black" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Active Terminal</h2>
                        </div>
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                            {cart.length} Items
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group text-gray-400 focus-within:text-black">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" />
                            <input
                                type="text"
                                placeholder="Customer Name"
                                value={customerInfo.name}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black/5"
                            />
                        </div>
                        <div className="relative group text-gray-400 focus-within:text-black">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black/5"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex gap-4 group">
                            <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={JSON.parse(item.product.images || '[]')[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                                <h4 className="text-xs font-black uppercase tracking-tight truncate text-gray-900 mb-1">{item.product.name}</h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-50 rounded-lg">
                                        <button onClick={() => updateQuantity(item.product.id, -1)} title="Decrease Quantity" className="p-1 px-2 hover:bg-gray-200 transition-colors"><Minus className="w-3 h-3" /></button>
                                        <span className="text-[10px] font-black w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => addToCart(item.product)} title="Increase Quantity" className="p-1 px-2 hover:bg-gray-200 transition-colors"><Plus className="w-3 h-3" /></button>
                                    </div>
                                    <p className="text-xs font-black text-gray-900 tracking-tight">₹{(Number(item.product.retailPrice || item.product.price) * item.quantity).toLocaleString()}</p>
                                </div>
                                <div className="mt-2">
                                    <button
                                        onClick={() => toggleEmbroidery(item.product.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${item.hasEmbroidery ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        <Palette className="w-3 h-3" />
                                        {item.hasEmbroidery ? `Branding Applied (+₹${embroideryPrice * item.quantity})` : 'Add Branding?'}
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.product.id)} title="Remove from Cart" className="p-2 h-fit text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                            <Receipt className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Cart Empty</p>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Due</span>
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{total.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            disabled={cart.length === 0 || processing}
                            onClick={() => handleCheckout('cash')}
                            className="bg-white border border-gray-200 text-gray-900 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-50 group"
                        >
                            <Receipt className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Cash</span>
                        </button>
                        <button
                            disabled={cart.length === 0 || processing}
                            onClick={() => handleCheckout('card')}
                            className="bg-white border border-gray-200 text-gray-900 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-50 group"
                        >
                            <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Card</span>
                        </button>
                        <button
                            disabled={cart.length === 0 || processing}
                            onClick={() => handleCheckout('upi')}
                            className="bg-blue-600 text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 group"
                        >
                            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black uppercase tracking-widest">UPI Pay</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Overlay */}
            {orderSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-[50px] p-16 text-center max-w-lg shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Check className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">Payment Success</h2>
                        <p className="text-gray-400 font-medium mb-12">Congratulations! Order <span className="text-black font-black">#{orderSuccess.id.slice(0, 8).toUpperCase()}</span> has been securely processed and recorded.</p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={printInvoice}
                                className="flex items-center justify-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:scale-105 transition"
                            >
                                <Printer className="w-5 h-5" />
                                Print Digital Invoice
                            </button>
                            <button
                                onClick={() => setOrderSuccess(null)}
                                className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-black transition"
                            >
                                New Transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
