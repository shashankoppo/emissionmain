import { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Lock, MapPin, User, Mail, Phone, ShieldCheck, Truck, CheckCircle, Tag, X } from 'lucide-react';
import { PageType, CartItem } from '../types';
import RazorpayCheckout from '../components/RazorpayCheckout';
import { couponAPI } from '../lib/api';

interface CartProps {
  onNavigate: (page: PageType, productId?: string) => void;
  cartItems?: CartItem[];
  onUpdateCart?: (items: CartItem[]) => void;
  customer?: { id: string; name: string; email: string; phone?: string } | null;
}

export default function Cart({ onNavigate, cartItems = [], onUpdateCart, customer }: CartProps) {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Pre-fill form if customer is logged in
  useEffect(() => {
    if (customer) {
      setCheckoutForm(prev => ({
        ...prev,
        name: customer.name || prev.name,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone,
      }));
    }
  }, [customer]);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => {
    const price = Number(item.product?.retailPrice) || Number(item.product?.price) || 0;
    return sum + price * item.quantity;
  }, 0), [cartItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const result = await couponAPI.validate(couponCode, subtotal);
      if (result.valid) {
        setDiscount(result.discount);
        setAppliedCoupon(result.code);
        setCouponCode('');
      } else {
        setCouponError(result.error || 'Invalid coupon');
      }
    } catch (error: any) {
      setCouponError(error.response?.data?.error || 'Failed to validate coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponError('');
  };

  const totalDue = Math.max(0, subtotal - discount);

  const handlePaymentSuccess = (_paymentId: string, _orderId: string) => {
    alert('Order Placed Successfully!');
    if (onUpdateCart) onUpdateCart([]);
    onNavigate('home');
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment Failed: ${error}`);
  };

  const isFormValid = checkoutForm.name && checkoutForm.email && checkoutForm.phone && checkoutForm.address && checkoutForm.city;

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <button
            onClick={() => onNavigate('products')}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Gallery</span>
          </button>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">Checkout</h1>
          <p className="text-gray-400 mt-4 font-medium tracking-wide">Securing your premium selection from our Jabalpur facility.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 p-20 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tight">Your cart is empty</h2>
            <p className="text-gray-400 max-w-sm mx-auto mb-12 leading-relaxed">It seems you haven't selected any masterpieces yet. Explore our collection for premium sportswear and medical wear.</p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-black text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition active:scale-95 shadow-xl shadow-black/10"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left: Form */}
            <div className="lg:col-span-7 space-y-10">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.03)] p-10">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl shadow-xl shadow-black/20">01</div>
                  <div>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight">Shipping</h2>
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Free Pan-India Delivery</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">Full Legal Name</label>
                    <div className="relative group">
                      <User className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={checkoutForm.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">Email Address</label>
                    <div className="relative group">
                      <Mail className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={checkoutForm.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none"
                        placeholder="rahul@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">Phone Number</label>
                    <div className="relative group">
                      <Phone className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={checkoutForm.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">Complete Address</label>
                    <div className="relative group">
                      <MapPin className="w-5 h-5 absolute left-5 top-6 text-gray-300 group-focus-within:text-black transition-colors" />
                      <textarea
                        name="address"
                        rows={3}
                        value={checkoutForm.address}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none resize-none"
                        placeholder="Street names, Flat NO., Area..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">City</label>
                    <input
                      type="text"
                      name="city"
                      value={checkoutForm.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none"
                      placeholder="Jabalpur"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">Pincode (Optional)</label>
                    <input
                      type="text"
                      name="pincode"
                      value={checkoutForm.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none"
                      placeholder="482001"
                    />
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Secure Payment</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-2">
                  <Truck className="w-6 h-6 text-green-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Domestic Free</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Quality Check</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-2">
                  <Lock className="w-6 h-6 text-purple-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">SSL Encrypted</span>
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-5">
              <div className="bg-black text-white rounded-[40px] p-10 sticky top-24 shadow-2xl shadow-black/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 uppercase tracking-tight"></div>

                <h3 className="text-2xl font-black mb-10 relative z-10">ORDER SUMMARY</h3>

                <div className="space-y-8 mb-12 relative z-10 max-h-[300px] overflow-y-auto scrollbar-hide pr-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center group">
                      <div className="w-20 h-24 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0 relative">
                        <img src={item.product?.images?.[0] || item.product?.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-[8px] font-black px-1.5 py-0.5 rounded-md">x{item.quantity}</div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-1">{item.product?.name}</p>
                        <div className="flex gap-2 mt-2">
                          {item.selectedSize && <span className="text-[8px] font-black text-gray-500 uppercase">S: {item.selectedSize}</span>}
                          {item.selectedColor && <span className="text-[8px] font-black text-gray-500 uppercase">C: {item.selectedColor}</span>}
                        </div>
                      </div>
                      <p className="font-black text-sm tracking-tight text-white/80">₹{((Number(item.product?.retailPrice || item.product?.price) || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-white/10 pt-8 mb-4 relative z-10">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-xs font-bold text-green-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount ({appliedCoupon})</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-blue-500">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Total Due</span>
                    <span className="text-3xl font-black tracking-tight">₹{totalDue.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mb-10 relative z-10">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="PROMO CODE"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-white/20 outline-none transition"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode}
                        title="Apply Coupon Code"
                        className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition disabled:opacity-50"
                      >
                        {isApplyingCoupon ? '...' : 'APPLY'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white/5 border border-dashed border-green-500/50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">{appliedCoupon} Applied</span>
                      </div>
                      <button onClick={removeCoupon} title="Remove Coupon" className="p-1 hover:bg-white/10 rounded-lg transition">
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mt-2 ml-1">{couponError}</p>}
                </div>

                {isFormValid ? (
                  <div className="relative z-10">
                    <RazorpayCheckout
                      amount={totalDue}
                      orderDetails={{
                        customerName: checkoutForm.name,
                        customerEmail: checkoutForm.email,
                        customerPhone: checkoutForm.phone,
                        shippingAddress: `${checkoutForm.address}, ${checkoutForm.city}${checkoutForm.pincode ? `, ${checkoutForm.pincode}` : ''}`,
                        items: cartItems.map(item => ({
                          productId: item.productId,
                          name: item.product?.name || 'Product',
                          quantity: item.quantity,
                          price: Number(item.product?.retailPrice || item.product?.price) || 0
                        }))
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      customerId={customer?.id}
                    />
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center relative z-10">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Verification Pending</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Please complete the shipping details to proceed to secure payment.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
