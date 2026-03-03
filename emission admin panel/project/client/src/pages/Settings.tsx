import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Save, RefreshCw, AlertCircle, CheckCircle2, Upload, Image as ImageIcon, ShieldCheck, Key, ShoppingBag, Palette } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';

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
        SITE_TITLE: 'Emission - Premium Sportswear & Medical Wear',
        SITE_DESCRIPTION: 'Premium OEM manufacturer of sportswear and medical wear engineered with precision.',
        SITE_LOGO: '',
        SITE_FAVICON: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({ logo: false, favicon: false });
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
                SITE_TITLE: response.data.SITE_TITLE || 'Emission - Premium Sportswear & Medical Wear',
                SITE_DESCRIPTION: response.data.SITE_DESCRIPTION || 'Premium OEM manufacturer of sportswear and medical wear engineered with precision.',
                SITE_LOGO: response.data.SITE_LOGO || '',
                SITE_FAVICON: response.data.SITE_FAVICON || '',
            });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'SITE_LOGO' | 'SITE_FAVICON') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [key === 'SITE_LOGO' ? 'logo' : 'favicon']: true }));
        const fData = new FormData();
        fData.append('file', file);
        try {
            const res = await api.post('/upload', fData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSettings(prev => ({ ...prev, [key]: res.data.url }));
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(prev => ({ ...prev, [key === 'SITE_LOGO' ? 'logo' : 'favicon']: false }));
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
                {/* SEO & Branding */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-8">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">SEO & Branding</h2>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Manage site identity and metadata</p>
                    </div>
                    <div className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Site Logo</label>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                        {settings.SITE_LOGO ? (
                                            <img src={`${API_BASE}${settings.SITE_LOGO}`} alt="Logo" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-200" />
                                        )}
                                    </div>
                                    <label className="flex-1 border-2 border-dashed border-gray-100 rounded-2xl p-6 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'SITE_LOGO')} />
                                        {uploading.logo ? (
                                            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5 text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Logo</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Favicon</label>
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                        {settings.SITE_FAVICON ? (
                                            <img src={`${API_BASE}${settings.SITE_FAVICON}`} alt="Favicon" className="w-full h-full object-contain p-3" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-gray-200" />
                                        )}
                                    </div>
                                    <label className="flex-1 border-2 border-dashed border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center gap-1">
                                        <input type="file" className="hidden" accept="image/x-icon,image/png" onChange={(e) => handleFileUpload(e, 'SITE_FAVICON')} />
                                        {uploading.favicon ? (
                                            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Favicon</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Site Title</label>
                                <input
                                    type="text"
                                    value={settings.SITE_TITLE}
                                    onChange={(e) => setSettings({ ...settings, SITE_TITLE: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold focus:ring-2 focus:ring-blue-600/10 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Meta Description</label>
                                <textarea
                                    value={settings.SITE_DESCRIPTION}
                                    onChange={(e) => setSettings({ ...settings, SITE_DESCRIPTION: e.target.value })}
                                    rows={3}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold focus:ring-2 focus:ring-blue-600/10 outline-none transition resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-8">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-black text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-black/10 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                    >
                        {saving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 transition-transform group-hover:scale-125" />
                        )}
                        {saving ? 'Updating...' : 'Save All Settings'}
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
