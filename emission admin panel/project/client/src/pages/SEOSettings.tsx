import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Globe, Save, RefreshCw, Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Search, BarChart2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';

export default function SEOSettings() {
    const [settings, setSettings] = useState({
        SITE_TITLE: 'Emission - Premium Sportswear & Medical Wear',
        SITE_DESCRIPTION: 'Premium OEM manufacturer of sportswear and medical wear engineered with precision. Born in Jabalpur, India.',
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
                SITE_TITLE: response.data.SITE_TITLE || 'Emission - Premium Sportswear & Medical Wear',
                SITE_DESCRIPTION: response.data.SITE_DESCRIPTION || 'Premium OEM manufacturer of sportswear and medical wear engineered with precision.',
                SITE_LOGO: response.data.SITE_LOGO || '',
                SITE_FAVICON: response.data.SITE_FAVICON || '',
            });
        } catch (error) {
            console.error('Failed to fetch SEO settings:', error);
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
            const res = await api.post('/upload', fData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSettings(prev => ({ ...prev, [key]: res.data.url }));
        } catch {
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
            setMessage({ type: 'success', text: 'SEO settings saved successfully!' });
        } catch {
            setMessage({ type: 'error', text: 'Failed to save settings.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    const previewTitle = settings.SITE_TITLE || 'Emission - Premium Sportswear & Medical Wear';
    const previewDesc = settings.SITE_DESCRIPTION || 'Premium OEM manufacturer…';
    const charCountTitle = settings.SITE_TITLE.length;
    const charCountDesc = settings.SITE_DESCRIPTION.length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-100 rounded-2xl">
                        <Globe className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">SEO & Branding</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Manage your site's identity, search visibility, and brand assets</p>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800 font-medium leading-relaxed">
                        <strong>Technical Partner:</strong> ELSxGlobal Divission of Evolucentsphere Private Limited — These settings control how your site appears in Google, social sharing cards, and browser tabs. Each product also auto-generates its own SEO on upload.
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Brand Assets */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="font-black text-gray-900 uppercase text-xs tracking-widest">Brand Assets</h2>
                        <p className="text-xs text-gray-400 mt-1">Logo and Favicon appear in browser tabs and app icons</p>
                    </div>
                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        {/* Logo */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Site Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {settings.SITE_LOGO
                                        ? <img src={`${API_BASE}${settings.SITE_LOGO}`} alt="Logo" className="w-full h-full object-contain p-2" />
                                        : <ImageIcon className="w-7 h-7 text-gray-200" />
                                    }
                                </div>
                                <label className="flex-1 border-2 border-dashed border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center gap-1.5">
                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'SITE_LOGO')} />
                                    {uploading.logo ? <RefreshCw className="w-5 h-5 animate-spin text-blue-600" /> : (
                                        <>
                                            <Upload className="w-4 h-4 text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Logo</span>
                                            <span className="text-[9px] text-gray-300">PNG, SVG recommended</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Favicon */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Favicon</label>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {settings.SITE_FAVICON
                                        ? <img src={`${API_BASE}${settings.SITE_FAVICON}`} alt="Favicon" className="w-full h-full object-contain p-1" />
                                        : <ImageIcon className="w-5 h-5 text-gray-200" />
                                    }
                                </div>
                                <label className="flex-1 border-2 border-dashed border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center gap-1.5">
                                    <input type="file" className="hidden" accept="image/x-icon,image/png" onChange={e => handleFileUpload(e, 'SITE_FAVICON')} />
                                    {uploading.favicon ? <RefreshCw className="w-4 h-4 animate-spin text-blue-600" /> : (
                                        <>
                                            <Upload className="w-4 h-4 text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Favicon</span>
                                            <span className="text-[9px] text-gray-300">ICO or PNG, 32×32px</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meta Content */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="font-black text-gray-900 uppercase text-xs tracking-widest">Page Meta Content</h2>
                        <p className="text-xs text-gray-400 mt-1">Shown in Google Search results and social sharing cards</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Site Title</label>
                                <span className={`text-[10px] font-bold ${charCountTitle > 60 ? 'text-red-500' : charCountTitle > 50 ? 'text-orange-500' : 'text-green-600'}`}>
                                    {charCountTitle}/60 chars
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Emission - Premium Sportswear & Medical Wear"
                                title="Site Title"
                                value={settings.SITE_TITLE}
                                onChange={e => setSettings({ ...settings, SITE_TITLE: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Description</label>
                                <span className={`text-[10px] font-bold ${charCountDesc > 160 ? 'text-red-500' : charCountDesc > 140 ? 'text-orange-500' : 'text-green-600'}`}>
                                    {charCountDesc}/160 chars
                                </span>
                            </div>
                            <textarea
                                placeholder="Premium OEM manufacturer of sportswear and medical wear..."
                                title="Meta Description"
                                value={settings.SITE_DESCRIPTION}
                                onChange={e => setSettings({ ...settings, SITE_DESCRIPTION: e.target.value })}
                                rows={3}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Google Preview */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <h2 className="font-black text-gray-900 uppercase text-xs tracking-widest">Google Search Preview</h2>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl">
                            <p className="text-xs text-green-700 mb-1 font-medium">emissionfit.com</p>
                            <p className="text-blue-700 text-lg font-medium leading-tight mb-1 hover:underline cursor-pointer truncate">
                                {previewTitle || 'Your site title will appear here'}
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                {previewDesc || 'Your meta description will appear here...'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save SEO Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
