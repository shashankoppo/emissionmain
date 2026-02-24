import { useState, useEffect } from 'react';
import api from '../lib/api';
import { LayoutGrid, Plus, Trash2, Edit2, XCircle } from 'lucide-react';

interface Collection {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    link: string | null;
    active: boolean;
    order: number;
}

export default function CollectionManagement() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        link: '/products',
        active: true,
        order: 0
    });

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const response = await api.get('/collections/admin');
            setCollections(response.data);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/collections/${editingId}`, formData);
            } else {
                await api.post('/collections', formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ title: '', description: '', imageUrl: '', link: '/products', active: true, order: 0 });
            fetchCollections();
        } catch (error) {
            alert('Failed to save collection');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/collections/${id}`);
            fetchCollections();
        } catch (error) {
            alert('Failed to delete collection');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Masterpiece Collections</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage the 3 showcase boxes on the main page</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ title: '', description: '', imageUrl: '', link: '/products', active: true, order: collections.length });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Collection
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections.map((col) => (
                    <div key={col.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
                        <div className="relative h-[400px] overflow-hidden">
                            <img src={col.imageUrl} alt={col.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${col.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {col.active ? 'Visible' : 'Hidden'}
                                </span>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="glass-card p-4 rounded-2xl text-white">
                                    <h3 className="font-black uppercase tracking-tight">{col.title}</h3>
                                    <p className="text-[10px] opacity-60 truncate">{col.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                                    ORDER: {col.order}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingId(col.id);
                                            setFormData({
                                                title: col.title,
                                                description: col.description || '',
                                                imageUrl: col.imageUrl,
                                                link: col.link || '/products',
                                                active: col.active,
                                                order: col.order
                                            });
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-gray-400 hover:text-black transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(col.id)}
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

            {collections.length === 0 && !loading && (
                <div className="py-24 text-center">
                    <LayoutGrid className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                    <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">No collections found</p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                {editingId ? 'Edit Collection' : 'New Collection'}
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
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                                />
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
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order</label>
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
                                <label htmlFor="active" className="text-sm font-bold text-gray-700">Set as Visible</label>
                            </div>
                            <button className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10">
                                {editingId ? 'Update Collection' : 'Create Collection'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
