import { useState } from 'react';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { PageType } from '../types';
import EmissionLogo from '../components/UI/EmissionLogo';
import { customerAPI } from '../lib/api';

interface RegisterProps {
    onNavigate: (page: PageType) => void;
    onRegister: (name: string, email: string) => void;
}

export default function Register({ onNavigate, onRegister }: RegisterProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (!agreed) {
            setError('Please agree to the terms and conditions.');
            return;
        }
        setLoading(true);
        try {
            const result = await customerAPI.register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });
            localStorage.setItem('customerToken', result.token);
            localStorage.setItem('customerUser', JSON.stringify(result.customer));
            onRegister(result.customer.name, result.customer.email);
        } catch (err: any) {
            const msg = err?.response?.data?.error || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Panel - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 -left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-40 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10">
                    <button onClick={() => onNavigate('home')}>
                        <EmissionLogo size="lg" color="white" />
                    </button>
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Join the<br />movement.
                    </h1>
                    <p className="text-lg text-gray-400 max-w-md">
                        Create your account and unlock exclusive access to premium sportswear, medical wear, and personalized shopping.
                    </p>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                            </div>
                            <span className="text-gray-300">Track your orders in real-time</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                            </div>
                            <span className="text-gray-300">Save your wishlist & preferences</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                            </div>
                            <span className="text-gray-300">Get exclusive offers & early access</span>
                        </div>
                    </div>
                </div>
                <div className="relative z-10" />
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <button onClick={() => onNavigate('home')}>
                            <EmissionLogo size="lg" color="black" />
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-black mb-2">Create account</h2>
                        <p className="text-gray-500">
                            Already have an account?{' '}
                            <button
                                onClick={() => onNavigate('login')}
                                className="text-black font-semibold hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Min 6 characters"
                                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    title="Toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Re-enter password"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input
                                type="checkbox"
                                id="agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <label htmlFor="agree" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <button type="button" onClick={() => onNavigate('terms')} className="text-black font-medium underline">Terms</button>
                                {' '}and{' '}
                                <button type="button" onClick={() => onNavigate('privacy')} className="text-black font-medium underline">Privacy Policy</button>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
