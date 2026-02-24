import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Image as ImageIcon, Plus, Trash2, Edit2, XCircle } from 'lucide-react';

interface Banner {
    id: string;
    title: string | null;
    subtitle: string | null;
    imageUrl: string;
    link: string | null;
    active: boolean;
    order: number;
}

export default function BannerManagement() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '/products',
        active: true,
        order: 0
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await api.get('/banners/admin');
            setBanners(response.data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/banners/${editingId}`, formData);
            } else {
                await api.post('/banners', formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ title: '', subtitle: '', imageUrl: '', link: '/products', active: true, order: 0 });
            fetchBanners();
        } catch (error) {
            alert('Failed to save banner');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/banners/${id}`);
            fetchBanners();
        } catch (error) {
            alert('Failed to delete banner');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Hero Banners</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage main page images and sliders</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ title: '', subtitle: '', imageUrl: '', link: '/products', active: true, order: banners.length });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Banner
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
                        <div className="relative h-48 overflow-hidden">
                            <img src={banner.imageUrl} alt={banner.title || ''} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${banner.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {banner.active ? 'Active' : 'Hidden'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex-1">
                            <h3 className="font-black text-gray-900 truncate">{banner.title || 'Untitled Banner'}</h3>
                            <p className="text-xs text-gray-400 mt-1 truncate">{banner.subtitle || 'No subtitle'}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                                    ORDER: {banner.order}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingId(banner.id);
                                            setFormData({
                                                title: banner.title || '',
                                                subtitle: banner.subtitle || '',
                                                imageUrl: banner.imageUrl,
                                                link: banner.link || '/products',
                                                active: banner.active,
                                                order: banner.order
                                            });
                                            setShowModal(true);
                                        }}
                                        title="Edit Banner"
                                        className="p-2 text-gray-400 hover:text-black transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        title="Delete Banner"
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {banners.length === 0 && !loading && (
                <div className="py-24 text-center">
                    <ImageIcon className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                    <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">No banners found</p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                {editingId ? 'Edit Banner' : 'New Banner'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Link</label>
                                    <input
                                        type="text"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <label htmlFor="active" className="text-sm font-bold text-gray-700">Set as Active Banner</label>
                            </div>
                            <button className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-[0.98]">
                                {editingId ? 'Update Banner' : 'Create Banner'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
