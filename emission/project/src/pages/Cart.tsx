import { useState } from 'react';
import { ShoppingCart, ArrowLeft, Lock, MapPin, User, Mail, Phone } from 'lucide-react';
import { PageType, CartItem } from '../types';
import Button from '../components/UI/Button';
import RazorpayCheckout from '../components/RazorpayCheckout';

interface CartProps {
  onNavigate: (page: PageType, productId?: string) => void;
  cartItems?: CartItem[];
  onUpdateCart?: (items: CartItem[]) => void;
}

export default function Cart({ onNavigate, cartItems = [], onUpdateCart }: CartProps) {
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Calculate total from passed items
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSuccess = (paymentId: string) => {
    alert(`Payment Successful! Transaction ID: ${paymentId}`);
    if (onUpdateCart) {
      onUpdateCart([]); // Clear cart
    }
    onNavigate('home');
    // In real app, redirect to Order Success page
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment Failed: ${error}`);
  };

  const isFormValid = checkoutForm.name && checkoutForm.email && checkoutForm.phone && checkoutForm.address && checkoutForm.city && checkoutForm.pincode && cartItems.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl font-bold ml-auto">Checkout</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6">Add some products to proceed to checkout.</p>
            <Button onClick={() => onNavigate('products')} variant="primary">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left: Shipping Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="text-xl font-bold text-black">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={checkoutForm.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={checkoutForm.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={checkoutForm.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Address</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={checkoutForm.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                        placeholder="Street Address, Flat No."
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={checkoutForm.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                      placeholder="Jabalpur"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={checkoutForm.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                      placeholder="482001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
                <h3 className="text-xl font-bold text-black mb-6">Order Summary</h3>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.product?.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-black line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}</p>
                      </div>
                      <p className="font-bold text-sm">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-black border-t border-gray-100 pt-3">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {isFormValid ? (
                  <RazorpayCheckout
                    amount={totalAmount}
                    orderDetails={{
                      customerName: checkoutForm.name,
                      customerEmail: checkoutForm.email,
                      customerPhone: checkoutForm.phone,
                      shippingAddress: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.pincode}`,
                      items: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product?.price || 0
                      }))
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <button disabled className="w-full bg-gray-200 text-gray-500 py-4 rounded-xl font-bold cursor-not-allowed">
                    Fill Shipping Details to Pay
                  </button>
                )}

                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Payment via Razorpay
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
