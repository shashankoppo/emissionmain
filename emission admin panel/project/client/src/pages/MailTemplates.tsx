import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Mail, Settings, RefreshCw, Save, Server, Shield } from 'lucide-react';

interface MailTemplate {
    id: string;
    type: string;
    subject: string;
    body: string;
    active: boolean;
}

export default function MailTemplates() {
    const [templates, setTemplates] = useState<MailTemplate[]>([]);
    const [smtpSettings, setSmtpSettings] = useState({
        smtp_host: '',
        smtp_port: '',
        smtp_user: '',
        smtp_pass: '',
        smtp_from: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'smtp' | 'templates'>('smtp');
    const [editingTemplate, setEditingTemplate] = useState<MailTemplate | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tempRes, smtpRes] = await Promise.all([
                api.get('/mail-templates'),
                api.get('/mail-templates/smtp')
            ]);
            setTemplates(tempRes.data);
            setSmtpSettings(smtpRes.data);
        } catch (error) {
            console.error('Failed to fetch mail data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSmtp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await api.post('/mail-templates/smtp', smtpSettings);
            alert('SMTP Settings Saved successfully!');
        } catch (error) {
            alert('Failed to save SMTP settings');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTemplate) return;
        try {
            setSaving(true);
            await api.put(`/mail-templates/${editingTemplate.id}`, editingTemplate);
            alert('Template updated!');
            setEditingTemplate(null);
            fetchData();
        } catch (error) {
            alert('Failed to update template');
        } finally {
            setSaving(false);
        }
    };

    const handleSeedTemplates = async () => {
        if (!confirm('This will create missing default templates. Proceed?')) return;
        try {
            await api.post('/mail-templates/seed');
            fetchData();
        } catch (error: any) {
            console.error('Seed error:', error);
            alert(error.response?.data?.error || 'Failed to seed templates');
        }
    };

    if (loading) return <div className="p-8">Loading mail settings...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 block flex items-center gap-3">
                    <Mail className="w-8 h-8 text-blue-600" />
                    Mail & Notifications
                </h1>
                <p className="text-gray-500 mt-2">Manage automated emails and SMTP server configurations</p>
            </div>

            <div className="flex gap-4 border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('smtp')}
                    className={`pb-4 px-4 font-semibold text-sm transition-colors ${activeTab === 'smtp' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-black'}`}
                >
                    <Server className="w-4 h-4 inline-block mr-2" /> Server Config
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`pb-4 px-4 font-semibold text-sm transition-colors ${activeTab === 'templates' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-black'}`}
                >
                    <Mail className="w-4 h-4 inline-block mr-2" /> Email Templates
                </button>
            </div>

            {activeTab === 'smtp' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5" /> SMTP Settings
                    </h2>
                    <form onSubmit={handleSaveSmtp} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Host</label>
                                <input
                                    type="text"
                                    value={smtpSettings.smtp_host}
                                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_host: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="smtp.gmail.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Port</label>
                                <input
                                    type="text"
                                    value={smtpSettings.smtp_port}
                                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_port: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="587"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">SMTP User</label>
                                <input
                                    type="text"
                                    value={smtpSettings.smtp_user}
                                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_user: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="noreply@yourdomain.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Password</label>
                                <input
                                    type="password"
                                    value={smtpSettings.smtp_pass}
                                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_pass: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••••••"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">From Email Address</label>
                                <input
                                    type="email"
                                    value={smtpSettings.smtp_from}
                                    onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Emission Orders <orders@emission.in>"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'templates' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Manage Templates</h2>
                        <button
                            onClick={handleSeedTemplates}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 text-sm"
                        >
                            <RefreshCw className="w-4 h-4" /> Seed Default Templates
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                            {templates.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setEditingTemplate(t)}
                                    className={`p-4 rounded-xl border cursor-pointer transition ${editingTemplate?.id === t.id ? 'border-blue-500 bg-blue-50' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-sm">{t.type}</span>
                                        <span className={`w-2 h-2 rounded-full ${t.active ? 'bg-green-500' : 'bg-red-500'}`} />
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{t.subject}</p>
                                </div>
                            ))}
                            {templates.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No templates found. Click "Seed Default Templates" to generate basic templates.</p>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            {editingTemplate ? (
                                <form onSubmit={handleSaveTemplate} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Edit {editingTemplate.type}</h3>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editingTemplate.active}
                                                onChange={(e) => setEditingTemplate({ ...editingTemplate, active: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            title="Email Subject"
                                            placeholder="Enter the template subject here"
                                            value={editingTemplate.subject}
                                            onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">HTML Body</label>
                                        <textarea
                                            title="Email HTML Body"
                                            placeholder="Enter the raw HTML body here"
                                            value={editingTemplate.body}
                                            onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                                            rows={12}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        ></textarea>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Available variables: {`{{customerName}}, {{orderId}}, {{amount}}`} depending on template type.
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Template'}
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 h-[400px] flex items-center justify-center flex-col text-gray-400">
                                    <Shield className="w-12 h-12 mb-4 text-gray-300" />
                                    <p className="font-medium">Select a template to configure</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
