import { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PincodeChecker() {
    const [pincode, setPincode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const checkPincode = (e: React.FormEvent) => {
        e.preventDefault();
        if (pincode.length !== 6) return;

        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            if (['482001', '400001', '110001', '560001'].includes(pincode) || Math.random() > 0.3) {
                setStatus('success');
                setMessage(`Delivery available by ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}.`);
            } else {
                setStatus('error');
                setMessage('Sorry, we do not deliver to this pincode yet.');
            }
        }, 1500);
    };

    return (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-8">
            <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-black" />
                <span className="text-sm font-bold text-black">Check Delivery Availability</span>
            </div>

            <form onSubmit={checkPincode} className="relative flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Pincode"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition"
                />
                <button
                    type="submit"
                    disabled={pincode.length !== 6 || status === 'loading'}
                    className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
                </button>
            </form>

            {status === 'success' && (
                <div className="flex items-center gap-2 mt-3 text-green-700 text-sm animate-fade-in">
                    <CheckCircle className="w-4 h-4" />
                    <span>{message}</span>
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm animate-fade-in">
                    <XCircle className="w-4 h-4" />
                    <span>{message}</span>
                </div>
            )}
        </div>
    );
}
