import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Save, Key, ShieldCheck, AlertCircle, ShoppingBag, Palette } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        RAZORPAY_KEY_ID: '',
        RAZORPAY_KEY_SECRET: '',
        PHONEPE_MERCHANT_ID: '',
        PHONEPE_SALT_KEY: '',
        PHONEPE_SALT_INDEX: '1',
        EMBROIDERY_PRICE: '250',
        SMTP_HOST: '',
        SMTP_PORT: '587',
        SMTP_USER: '',
        SMTP_PASS: '',
        SMTP_FROM: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            setSettings({
                RAZORPAY_KEY_ID: response.data.RAZORPAY_KEY_ID || '',
                RAZORPAY_KEY_SECRET: response.data.RAZORPAY_KEY_SECRET || '',
                PHONEPE_MERCHANT_ID: response.data.PHONEPE_MERCHANT_ID || '',
                PHONEPE_SALT_KEY: response.data.PHONEPE_SALT_KEY || '',
                PHONEPE_SALT_INDEX: response.data.PHONEPE_SALT_INDEX || '1',
                EMBROIDERY_PRICE: response.data.EMBROIDERY_PRICE || '250',
                SMTP_HOST: response.data.SMTP_HOST || '',
                SMTP_PORT: response.data.SMTP_PORT || '587',
                SMTP_USER: response.data.SMTP_USER || '',
                SMTP_PASS: response.data.SMTP_PASS || '',
                SMTP_FROM: response.data.SMTP_FROM || '',
            });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/settings', settings);
            setMessage({ type: 'success', text: 'Settings saved successfully' });
        } catch (error) {
            console.error('Failed to save settings:', error);
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Settings</h1>
                <p className="text-gray-500 mt-2 font-medium">Gateway configurations and global business rules</p>
            </div>

            <form onSubmit={handleSave} className="space-y-12">
                {message.text && (
                    <div className={`p-6 rounded-[24px] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {message.type === 'success' ? <Save className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="font-bold text-sm uppercase tracking-wider">{message.text}</p>
                    </div>
                )}

                {/* Razorpay Section */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-3 text-gray-900 font-black uppercase text-xs tracking-widest">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            <h2>Razorpay Configuration</h2>
                        </div>
                    </div>
                    <div className="p-8 grid gap-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Key className="w-4 h-4" />
                                    Key ID
                                </label>
                                <input
                                    type="text"
                                    value={settings.RAZORPAY_KEY_ID}
                                    onChange={(e) => setSettings({ ...settings, RAZORPAY_KEY_ID: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition"
                                    placeholder="rzp_live_..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Key className="w-4 h-4" />
                                    Key Secret
                                </label>
                                <input
                                    type="password"
                                    value={settings.RAZORPAY_KEY_SECRET}
                                    onChange={(e) => setSettings({ ...settings, RAZORPAY_KEY_SECRET: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition"
                                    placeholder="••••••••••••••••"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PhonePe Section */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-3 text-gray-900 font-black uppercase text-xs tracking-widest">
                            <ShoppingBag className="w-5 h-5 text-purple-600" />
                            <h2>PhonePe Gateway (New)</h2>
                        </div>
                    </div>
                    <div className="p-8 grid gap-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Merchant ID</label>
                                <input
                                    type="text"
                                    value={settings.PHONEPE_MERCHANT_ID}
                                    onChange={(e) => setSettings({ ...settings, PHONEPE_MERCHANT_ID: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none transition"
                                    placeholder="MID12345678"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Salt Key</label>
                                <input
                                    type="password"
                                    value={settings.PHONEPE_SALT_KEY}
                                    onChange={(e) => setSettings({ ...settings, PHONEPE_SALT_KEY: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none transition"
                                    placeholder="••••••••••••••••"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Salt Index</label>
                                <input
                                    type="text"
                                    value={settings.PHONEPE_SALT_INDEX}
                                    onChange={(e) => setSettings({ ...settings, PHONEPE_SALT_INDEX: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none transition"
                                    placeholder="1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Rules */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-3 text-gray-900 font-black uppercase text-xs tracking-widest">
                            <Palette className="w-5 h-5 text-orange-600" />
                            <h2>Customization Rules</h2>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="w-[300px]">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Embroidery Charge (₹)</label>
                            <input
                                type="number"
                                value={settings.EMBROIDERY_PRICE}
                                onChange={(e) => setSettings({ ...settings, EMBROIDERY_PRICE: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-orange-500/10 outline-none transition"
                                placeholder="250"
                            />
                            <p className="mt-2 text-xs font-bold text-gray-400 tracking-tight">Standard fee for medical wear branding</p>
                        </div>
                    </div>
                </div>

                {/* SMTP Section */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-3 text-gray-900 font-black uppercase text-xs tracking-widest">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            <h2>Mail Server (SMTP)</h2>
                        </div>
                    </div>
                    <div className="p-8 grid gap-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SMTP Host</label>
                                <input
                                    type="text"
                                    value={settings.SMTP_HOST}
                                    onChange={(e) => setSettings({ ...settings, SMTP_HOST: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-green-500/10 outline-none transition"
                                    placeholder="smtp.gmail.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SMTP Port</label>
                                <input
                                    type="text"
                                    value={settings.SMTP_PORT}
                                    onChange={(e) => setSettings({ ...settings, SMTP_PORT: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-green-500/10 outline-none transition"
                                    placeholder="587"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Username</label>
                                <input
                                    type="text"
                                    value={settings.SMTP_USER}
                                    onChange={(e) => setSettings({ ...settings, SMTP_USER: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-green-500/10 outline-none transition"
                                    placeholder="your-email@gmail.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                                <input
                                    type="password"
                                    value={settings.SMTP_PASS}
                                    onChange={(e) => setSettings({ ...settings, SMTP_PASS: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-green-500/10 outline-none transition"
                                    placeholder="••••••••••••••••"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">From Email</label>
                            <input
                                type="text"
                                value={settings.SMTP_FROM}
                                onChange={(e) => setSettings({ ...settings, SMTP_FROM: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-green-500/10 outline-none transition"
                                placeholder="Emission <no-reply@emission.com>"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-3 bg-black text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-black/10 active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Synchronizing...' : 'Commit Changes'}
                    </button>
                </div>
            </form>

            <div className="mt-12 bg-blue-50/50 border border-blue-100 rounded-[32px] p-8">
                <h3 className="text-blue-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Operational Security
                </h3>
                <p className="text-blue-800 text-sm font-medium leading-relaxed">
                    Settings configured here are updated in real-time across the platform. Ensure Salt Keys and Secrets are correct to maintain transaction integrity. Global embroidery charges will apply to all medical apparel marked with the "Customization" tag.
                </p>
            </div>
        </div>
    );
}
