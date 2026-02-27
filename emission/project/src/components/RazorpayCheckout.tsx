import { useState } from 'react';
import api from '../lib/api';

interface RazorpayCheckoutProps {
    amount: number;
    orderDetails: {
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        shippingAddress: string;
        items: any[];
    };
    onSuccess: (paymentId: string, orderId: string) => void;
    onError: (error: string) => void;
    customerId?: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function RazorpayCheckout({
    amount,
    orderDetails,
    onSuccess,
    onError,
    customerId
}: RazorpayCheckoutProps) {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load Razorpay SDK');
            }

            // 1. Fetch public Razorpay Key ID
            const { data: settingsResponse } = await api.get('/settings/public');
            const razorpayKey = settingsResponse.RAZORPAY_KEY_ID;

            if (!razorpayKey) {
                throw new Error('Razorpay is not configured on the server');
            }

            // 2. Create order on backend
            const { data: orderResponse } = await api.post(
                '/payment/create-order',
                {
                    amount,
                    currency: 'INR',
                    receipt: `order_${Date.now()}`,
                    orderDetails,
                    customerId,
                }
            );

            if (!orderResponse.success) {
                throw new Error(orderResponse.error || 'Failed to create order');
            }

            const order = orderResponse.order;

            // 3. Initialize Razorpay
            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: 'Emission',
                description: 'Sportswear & Medical Wear',
                image: '/logo.png', // Add your logo
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        setLoading(true);

                        // 3. Verify payment on backend
                        const { data } = await api.post(
                            '/payment/verify-payment',
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderDetails: {
                                    ...orderDetails,
                                    totalAmount: amount,
                                },
                                customerId,
                            }
                        );

                        if (data.success) {
                            onSuccess(response.razorpay_payment_id, data.order.id);
                        } else {
                            onError(data.error || 'Payment verification failed');
                        }
                    } catch (error: any) {
                        console.error('Payment verification error:', error);
                        onError(error.response?.data?.error || 'Payment verification failed');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: orderDetails.customerName,
                    email: orderDetails.customerEmail,
                    contact: orderDetails.customerPhone,
                },
                notes: {
                    address: orderDetails.shippingAddress,
                },
                theme: {
                    color: '#000000',
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response: any) {
                setLoading(false);
                onError(response.error.description || 'Payment failed');
            });

            rzp.open();
        } catch (error: any) {
            console.error('Payment initiation error:', error);
            onError(error.response?.data?.error || error.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            ) : (
                `Pay ₹${amount.toLocaleString('en-IN')}`
            )}
        </button>
    );
}
