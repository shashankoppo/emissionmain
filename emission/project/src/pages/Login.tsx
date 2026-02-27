import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { PageType } from '../types';
import EmissionLogo from '../components/UI/EmissionLogo';
import { customerAPI } from '../lib/api';

interface LoginProps {
    onNavigate: (page: PageType) => void;
    onLogin: (name: string, email: string) => void;
}

export default function Login({ onNavigate, onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await customerAPI.login(email, password);
            localStorage.setItem('customerToken', result.token);
            localStorage.setItem('customerUser', JSON.stringify(result.customer));
            onLogin(result.customer.name, result.customer.email);
        } catch {
            setError('Invalid email or password. Please try again.');
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
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10">
                    <button onClick={() => onNavigate('home')}>
                        <EmissionLogo size="lg" color="white" />
                    </button>
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Welcome<br />back.
                    </h1>
                    <p className="text-lg text-gray-400 max-w-md">
                        Sign in to your account to track orders, manage your wishlist, and enjoy a seamless shopping experience.
                    </p>
                </div>
                <div className="relative z-10 flex gap-8 text-sm text-gray-500">
                    <div>
                        <p className="text-3xl font-bold text-white">10K+</p>
                        <p>Happy Customers</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">500+</p>
                        <p>Products</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">4.8★</p>
                        <p>Average Rating</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <button onClick={() => onNavigate('home')}>
                            <EmissionLogo size="lg" color="black" />
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-black mb-2">Sign in</h2>
                        <p className="text-gray-500">
                            Don't have an account?{' '}
                            <button
                                onClick={() => onNavigate('register')}
                                className="text-black font-semibold hover:underline"
                            >
                                Create one
                            </button>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <button type="button" className="text-xs text-gray-500 hover:text-black transition">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>


                    <p className="mt-8 text-center text-xs text-gray-400">
                        By signing in, you agree to our{' '}
                        <button onClick={() => onNavigate('terms')} className="underline hover:text-gray-600">Terms</button>
                        {' '}and{' '}
                        <button onClick={() => onNavigate('privacy')} className="underline hover:text-gray-600">Privacy Policy</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
