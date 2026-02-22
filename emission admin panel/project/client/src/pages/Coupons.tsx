import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Tag, Plus, Trash2, Edit2, Search, Calendar, Percent, IndianRupee, ToggleLeft, ToggleRight, XCircle, CheckCircle2 } from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    maxDiscount?: number;
    expiryDate?: string;
    usageLimit: number;
    usedCount: number;
    active: boolean;
    createdAt: string;
}

export default function Coupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        expiryDate: '',
        usageLimit: 0,
        active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await api.get('/coupons');
            setCoupons(response.data);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (coupon: Coupon) => {
        try {
            await api.put(`/coupons/${coupon.id}`, { ...coupon, active: !coupon.active });
            setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, active: !c.active } : c));
        } catch (error) {
            alert('Failed to update coupon status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (error) {
            alert('Failed to delete coupon');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCoupon) {
                await api.put(`/coupons/${editingCoupon.id}`, formData);
                setMessage({ type: 'success', text: 'Coupon updated successfully' });
            } else {
                await api.post('/coupons', formData);
                setMessage({ type: 'success', text: 'Coupon created successfully' });
            }
            fetchCoupons();
            setShowForm(false);
            setEditingCoupon(null);
            resetForm();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to save coupon');
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: 0,
            minOrderAmount: 0,
            maxDiscount: 0,
            expiryDate: '',
            usageLimit: 0,
            active: true
        });
    };

    const openEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: Number(coupon.discountValue),
            minOrderAmount: Number(coupon.minOrderAmount),
            maxDiscount: Number(coupon.maxDiscount || 0),
            expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
            usageLimit: coupon.usageLimit,
            active: coupon.active
        });
        setShowForm(true);
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Coupons</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage discount codes and promotional offers</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditingCoupon(null); setShowForm(true); }}
                    className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Create Coupon
                </button>
            </div>

            {message.text && (
                <div className={`mb-8 p-6 rounded-[24px] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-bold text-sm uppercase tracking-wider">{message.text}</p>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search by code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-16 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Code</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Requirements</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Usage</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-8 py-8"><div className="h-4 bg-gray-50 rounded-full w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-black text-white p-2 rounded-lg">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-black tracking-tight">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-sm font-black text-gray-900">
                                        {coupon.discountType === 'percentage' ? (
                                            <div className="flex items-center gap-1">
                                                <Percent className="w-3 h-3 text-blue-600" />
                                                {coupon.discountValue}% OFF
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-3 h-3 text-green-600" />
                                                ₹{Number(coupon.discountValue).toLocaleString()} OFF
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-8">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Min Order</p>
                                        <span className="text-xs font-black text-gray-900">₹{Number(coupon.minOrderAmount).toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-black text-gray-900">{coupon.usedCount} <span className="text-gray-400">used</span></span>
                                            {coupon.usageLimit > 0 && (
                                                <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600"
                                                        style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <button onClick={() => handleToggleActive(coupon)}>
                                            {coupon.active ? (
                                                <ToggleRight className="w-8 h-8 text-green-500" />
                                            ) : (
                                                <ToggleLeft className="w-8 h-8 text-gray-300" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEdit(coupon)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-black hover:text-white transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(coupon.id)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCoupons.length === 0 && !loading && (
                    <div className="py-24 text-center">
                        <Tag className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                        <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">No coupons found</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <form onSubmit={handleSubmit} className="p-10">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                                        {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                                    </h2>
                                    <p className="text-gray-400 font-medium text-xs mt-1">Define your discount logic and limits</p>
                                </div>
                                <button type="button" onClick={() => setShowForm(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition">
                                    <XCircle className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Coupon Code</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-black/5 outline-none transition"
                                            placeholder="SUMMER50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Discount Type</label>
                                        <select
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-black/5 outline-none transition"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Discount Value</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-black/5 outline-none transition"
                                            placeholder="10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Min Order Amount (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.minOrderAmount}
                                            onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-black/5 outline-none transition"
                                            placeholder="500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-black/5 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Usage Limit (0 for ∞)</label>
                                        <input
                                            type="number"
                                            value={formData.usageLimit}
                                            onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-black/5 outline-none transition"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-black/10 active:scale-95"
                                >
                                    {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all text-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
