import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Save, Key, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        RAZORPAY_KEY_ID: '',
        RAZORPAY_KEY_SECRET: '',
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
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage payment gateway and API configurations</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        <h2>Payment Gateway (Razorpay)</h2>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    {message.text && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.type === 'success' ? <Save className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <p>{message.text}</p>
                        </div>
                    )}

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Key className="w-4 h-4 text-gray-400" />
                                Razorpay Key ID
                            </label>
                            <input
                                type="text"
                                value={settings.RAZORPAY_KEY_ID}
                                onChange={(e) => setSettings({ ...settings, RAZORPAY_KEY_ID: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="rzp_test_..."
                            />
                            <p className="mt-1 text-xs text-gray-500">Your public Razorpay API key</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Key className="w-4 h-4 text-gray-400" />
                                Razorpay Key Secret
                            </label>
                            <input
                                type="password"
                                value={settings.RAZORPAY_KEY_SECRET}
                                onChange={(e) => setSettings({ ...settings, RAZORPAY_KEY_SECRET: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••••••••••"
                            />
                            <p className="mt-1 text-xs text-gray-500">Your private Razorpay API secret (stored securely)</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Important Note
                </h3>
                <p className="text-blue-700 text-sm">
                    Settings configured here will take precedence over environment variables (`.env`).
                    Please ensure your Razorpay keys are correct to avoid payment processing issues on the main website.
                </p>
            </div>
        </div>
    );
}
