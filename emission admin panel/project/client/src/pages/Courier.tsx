import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Truck, Plus, Trash2, Edit2, Globe, Shield } from 'lucide-react';

interface Courier {
    id: string;
    name: string;
    api_key: string;
    apiUrl: string;
    active: boolean;
}

export default function Courier() {
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', api_key: '', apiUrl: '', active: true });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCouriers();
    }, []);

    const fetchCouriers = async () => {
        try {
            const response = await api.get('/couriers');
            setCouriers(response.data);
        } catch (error) {
            console.error('Failed to fetch couriers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/couriers/${editingId}`, formData);
            } else {
                await api.post('/couriers', formData);
            }
            fetchCouriers();
            setShowModal(false);
            setFormData({ name: '', api_key: '', apiUrl: '', active: true });
            setEditingId(null);
        } catch (error) {
            console.error('Failed to save courier:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this courier?')) return;
        try {
            await api.delete(`/couriers/${id}`);
            fetchCouriers();
        } catch (error) {
            console.error('Failed to delete courier:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Delivery Partners</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your logistics and courier integrations</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setEditingId(null); setFormData({ name: '', api_key: '', apiUrl: '', active: true }); }}
                    className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Partner
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {couriers.map((courier) => (
                        <div key={courier.id} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500">
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                    <Truck className="w-8 h-8 text-black group-hover:text-blue-600 transition-colors" />
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${courier.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {courier.active ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">{courier.name}</h3>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span className="truncate">{courier.apiUrl || 'No Endpoint Set'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>API Key: {courier.api_key ? '••••••••' : 'Not Set'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                                <button
                                    onClick={() => { setEditingId(courier.id); setFormData(courier); setShowModal(true); }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-900 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(courier.id)}
                                    title="Delete Partner"
                                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {couriers.length === 0 && (
                        <div className="col-span-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] py-32 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">No Partners Found</h3>
                            <p className="text-gray-400 mt-2 font-medium">Add your first delivery partner to start shipping</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-gray-50">
                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                                {editingId ? 'Edit Partner' : 'Add New Partner'}
                            </h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">Configure logistics integration details</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">Partner Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none"
                                        placeholder="e.g. BlueDart, Delhivery"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">API Endpoint</label>
                                    <input
                                        type="url"
                                        value={formData.apiUrl}
                                        onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none"
                                        placeholder="https://api.courier.com/v1"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block">Secret API Key</label>
                                    <input
                                        type="password"
                                        value={formData.api_key}
                                        onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 transition outline-none"
                                        placeholder="••••••••••••••••"
                                    />
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-5 h-5 rounded-md border-gray-300 text-black focus:ring-black"
                                    />
                                    <label htmlFor="active" className="text-sm font-bold text-gray-700 uppercase tracking-wide cursor-pointer">Set as active partner</label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-50 text-gray-900 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10"
                                >
                                    {editingId ? 'Save Changes' : 'Add Partner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const Package = Truck; // Using Truck as fallback for Package icon if needed
