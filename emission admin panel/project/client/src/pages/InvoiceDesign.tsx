import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Save, RefreshCcw, Palette, Building2, Phone, FileText, CheckCircle2 } from 'lucide-react';

interface InvoiceTemplate {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    terms: string;
    primaryColor: string;
    accentColor: string;
    gstNumber: string;
}

export default function InvoiceDesign() {
    const [template, setTemplate] = useState<InvoiceTemplate>({
        companyName: 'EMISSION',
        companyAddress: '',
        companyPhone: '',
        companyEmail: '',
        terms: '',
        primaryColor: '#1a1a1a',
        accentColor: '#3b82f6',
        gstNumber: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchTemplate();
    }, []);

    const fetchTemplate = async () => {
        try {
            const response = await api.get('/invoices/template');
            if (response.data) {
                setTemplate(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch template:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await api.put('/invoices/template', template);
            setMessage({ type: 'success', text: 'Invoice template updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save template.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Invoice Design</h1>
                    <p className="text-gray-500 mt-2 font-medium">Customize your brand identity on digital and printed invoices</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                >
                    {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Saving...' : 'Save Design'}
                </button>
            </div>

            {message && (
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Editor */}
                <div className="space-y-8">
                    {/* Brand Identity */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Brand Identity</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                                <input
                                    type="text"
                                    value={template.companyName}
                                    onChange={e => setTemplate({ ...template, companyName: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">GST Number</label>
                                <input
                                    type="text"
                                    value={template.gstNumber}
                                    onChange={e => setTemplate({ ...template, gstNumber: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Contact Details</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Address</label>
                                <textarea
                                    value={template.companyAddress}
                                    onChange={e => setTemplate({ ...template, companyAddress: e.target.value })}
                                    rows={2}
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                                    <input
                                        type="text"
                                        value={template.companyPhone}
                                        onChange={e => setTemplate({ ...template, companyPhone: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={template.companyEmail}
                                        onChange={e => setTemplate({ ...template, companyEmail: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Design & Colors */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Palette className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Design System</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Primary Theme</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={template.primaryColor}
                                        onChange={e => setTemplate({ ...template, primaryColor: e.target.value })}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
                                    />
                                    <span className="text-xs font-mono font-bold text-gray-500 uppercase">{template.primaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Accent Highlights</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={template.accentColor}
                                        onChange={e => setTemplate({ ...template, accentColor: e.target.value })}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
                                    />
                                    <span className="text-xs font-mono font-bold text-gray-500 uppercase">{template.accentColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Invoice Terms</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Terms & Conditions</label>
                            <textarea
                                value={template.terms}
                                onChange={e => setTemplate({ ...template, terms: e.target.value })}
                                rows={3}
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <div className="bg-gray-900 rounded-[40px] p-3 shadow-2xl">
                        <div className="bg-white rounded-[32px] overflow-hidden min-h-[700px] flex flex-col scale-[0.98] origin-top">
                            {/* Inner Preview Content */}
                            <div className="p-10 flex-1">
                                <div className="flex justify-between items-start mb-12">
                                    <div style={{ color: template.primaryColor }}>
                                        <h2 className="text-2xl font-black tracking-tighter uppercase">{template.companyName}</h2>
                                        <div className="w-8 h-1 mt-1" style={{ backgroundColor: template.accentColor }}></div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Invoice #</p>
                                        <p className="text-sm font-black text-gray-900 font-mono">INV-2024-001</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10 mb-10">
                                    <div>
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">Billed From</p>
                                        <p className="text-[10px] font-black text-gray-900">{template.companyName}</p>
                                        <p className="text-[10px] font-medium text-gray-500 leading-relaxed mt-1">{template.companyAddress}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-2">{template.companyPhone}</p>
                                        <p className="text-[10px] font-bold text-gray-400">{template.companyEmail}</p>
                                        {template.gstNumber && <p className="text-[8px] font-black text-gray-900 mt-2">GST: {template.gstNumber}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">Billed To</p>
                                        <p className="text-[10px] font-black text-gray-900">Customer Name</p>
                                        <p className="text-[10px] font-medium text-gray-500 mt-1">123 Street Address,<br />City, Country</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 py-4">
                                    <div className="flex justify-between px-2 mb-4">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Item</span>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Amount</span>
                                    </div>
                                    <div className="flex justify-between px-2 py-4 bg-gray-50 rounded-xl mb-2">
                                        <span className="text-[10px] font-black text-gray-700">Premium Cotton T-Shirt x 50</span>
                                        <span className="text-[10px] font-black text-gray-900">₹25,000.00</span>
                                    </div>
                                    <div className="flex justify-between px-2 py-4 bg-gray-50 rounded-xl">
                                        <span className="text-[10px] font-black text-gray-700">Custom Embroidery Service</span>
                                        <span className="text-[10px] font-black text-gray-900">₹2,500.00</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-end">
                                    <div className="max-w-[150px]">
                                        <p className="text-[7px] font-bold text-gray-400 leading-normal">{template.terms}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                        <p className="text-xl font-black text-gray-900" style={{ color: template.primaryColor }}>₹27,500.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 w-full" style={{ backgroundColor: template.primaryColor }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
