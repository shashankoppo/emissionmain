import { useState, useEffect } from 'react';
import api from '../lib/api';
import {
    Mail, RefreshCw, Save, Server, Plus, Trash2,
    Eye, Code2, CheckCircle2, AlertCircle, X
} from 'lucide-react';

interface MailTemplate {
    id: string;
    type: string;
    subject: string;
    body: string;
    active: boolean;
}

const DEFAULT_HTML = `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb">
  <h1 style="color:#111;font-size:24px">Hello, {{customerName}}!</h1>
  <p style="color:#555">Your message body here...</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
  <p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p>
</div>`;

export default function MailTemplates() {
    const [templates, setTemplates] = useState<MailTemplate[]>([]);
    const [smtpSettings, setSmtpSettings] = useState({
        smtp_host: '', smtp_port: '587', smtp_user: '', smtp_pass: '', smtp_from: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [activeTab, setActiveTab] = useState<'smtp' | 'templates'>('templates');
    const [selectedTemplate, setSelectedTemplate] = useState<MailTemplate | null>(null);
    const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ type: '', subject: '', body: DEFAULT_HTML, active: true });
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => { fetchData(); }, []);

    const showToast = (type: 'success' | 'error', text: string) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const tempRes = await api.get('/mail-templates');
            const data = Array.isArray(tempRes.data) ? tempRes.data : [];
            setTemplates(data);
            if (data.length > 0 && !selectedTemplate) setSelectedTemplate(data[0]);
        } catch (error) {
            console.error('Failed to fetch mail templates', error);
            showToast('error', 'Failed to load templates. Try seeding defaults.');
        }
        try {
            const smtpRes = await api.get('/mail-templates/smtp');
            setSmtpSettings(smtpRes.data);
        } catch (error) {
            console.error('Failed to fetch SMTP settings', error);
        }
        setLoading(false);
    };

    const handleSeedTemplates = async () => {
        setSeeding(true);
        try {
            const res = await api.post('/mail-templates/seed');
            showToast('success', res.data.message || 'Default templates seeded!');
            await fetchData();
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Failed to seed templates');
        } finally {
            setSeeding(false);
        }
    };

    const handleSaveTemplate = async () => {
        if (!selectedTemplate) return;
        setSaving(true);
        try {
            await api.put(`/mail-templates/${selectedTemplate.id}`, selectedTemplate);
            showToast('success', `"${selectedTemplate.type}" saved successfully!`);
            setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? selectedTemplate : t));
        } catch {
            showToast('error', 'Failed to save template.');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.post('/mail-templates', newTemplate);
            showToast('success', `Template "${newTemplate.type}" created!`);
            setTemplates(prev => [...prev, res.data]);
            setSelectedTemplate(res.data);
            setShowCreateModal(false);
            setNewTemplate({ type: '', subject: '', body: DEFAULT_HTML, active: true });
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Failed to create template.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTemplate = async (template: MailTemplate) => {
        if (!confirm(`Delete template "${template.type}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/mail-templates/${template.id}`);
            showToast('success', `Template deleted.`);
            setTemplates(prev => prev.filter(t => t.id !== template.id));
            setSelectedTemplate(templates.find(t => t.id !== template.id) || null);
        } catch {
            showToast('error', 'Failed to delete template.');
        }
    };

    const handleSaveSmtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/mail-templates/smtp', smtpSettings);
            showToast('success', 'SMTP settings saved!');
        } catch {
            showToast('error', 'Failed to save SMTP settings.');
        } finally {
            setSaving(false);
        }
    };

    const typeLabel = (type: string) => type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    {toast.text}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                        <Mail className="w-8 h-8 text-blue-600" /> Mail & Notifications
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage automated email templates and SMTP server</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSeedTemplates}
                        disabled={seeding}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
                        {seeding ? 'Seeding...' : 'Seed Defaults'}
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-lg"
                    >
                        <Plus className="w-4 h-4" /> New Template
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
                {(['templates', 'smtp'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                    >
                        {tab === 'smtp' ? <><Server className="w-3.5 h-3.5 inline mr-1.5" />SMTP Config</> : <><Mail className="w-3.5 h-3.5 inline mr-1.5" />Email Templates</>}
                    </button>
                ))}
            </div>

            {/* ---- TEMPLATES TAB ---- */}
            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Template List */}
                    <div className="lg:col-span-4 space-y-2">
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <RefreshCw className="w-8 h-8 animate-spin mb-3" />
                                <p className="text-xs font-bold uppercase tracking-widest">Loading templates...</p>
                            </div>
                        )}
                        {!loading && templates.length === 0 && (
                            <div className="text-center py-16 px-4 bg-white rounded-[28px] border border-dashed border-gray-200">
                                <Mail className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="font-black text-gray-400 uppercase text-xs tracking-widest mb-4">No templates found</p>
                                <button
                                    onClick={handleSeedTemplates}
                                    disabled={seeding}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition flex items-center gap-2 mx-auto disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
                                    {seeding ? 'Creating...' : 'Create Default Templates'}
                                </button>
                            </div>
                        )}
                        {!loading && templates.map(t => (
                            <div
                                key={t.id}
                                onClick={() => { setSelectedTemplate({ ...t }); setPreviewMode('code'); }}
                                className={`group p-4 rounded-2xl border cursor-pointer transition-all ${selectedTemplate?.id === t.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-sm'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span className="font-black text-gray-900 text-sm truncate">{typeLabel(t.type)}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate pl-4">{t.subject}</p>
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleDeleteTemplate(t); }}
                                        title="Delete template"
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition ml-2 flex-shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Template Editor */}
                    <div className="lg:col-span-8">
                        {selectedTemplate ? (
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                                {/* Editor Header */}
                                <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-black text-gray-900 uppercase text-sm tracking-wide">{typeLabel(selectedTemplate.type)}</h2>
                                        <p className="text-xs text-gray-400 mt-0.5">Edit template content below</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Active Toggle */}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <div
                                                onClick={() => setSelectedTemplate({ ...selectedTemplate, active: !selectedTemplate.active })}
                                                className={`w-10 h-5 rounded-full transition-colors relative ${selectedTemplate.active ? 'bg-green-500' : 'bg-gray-200'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${selectedTemplate.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{selectedTemplate.active ? 'Active' : 'Inactive'}</span>
                                        </label>
                                        {/* Preview Toggle */}
                                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                                            <button
                                                onClick={() => setPreviewMode('code')}
                                                className={`p-1.5 rounded-lg transition ${previewMode === 'code' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                                                title="Code view"
                                            >
                                                <Code2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setPreviewMode('preview')}
                                                className={`p-1.5 rounded-lg transition ${previewMode === 'preview' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                                                title="Preview"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleSaveTemplate}
                                            disabled={saving}
                                            className="bg-black text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                            Save
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 space-y-5">
                                    {/* Subject */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Subject</label>
                                        <input
                                            type="text"
                                            title="Email Subject"
                                            placeholder="Enter the email subject line..."
                                            value={selectedTemplate.subject}
                                            onChange={e => setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition"
                                        />
                                    </div>

                                    {/* Body / Preview */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            {previewMode === 'code' ? 'HTML Body' : 'Email Preview'}
                                        </label>
                                        {previewMode === 'code' ? (
                                            <textarea
                                                title="HTML Email Body"
                                                placeholder="Enter the HTML body of the email..."
                                                value={selectedTemplate.body}
                                                onChange={e => setSelectedTemplate({ ...selectedTemplate, body: e.target.value })}
                                                rows={16}
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-mono text-xs focus:ring-2 focus:ring-blue-500/10 outline-none transition resize-none leading-relaxed"
                                            />
                                        ) : (
                                            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 p-4">
                                                <iframe
                                                    title="Email Preview"
                                                    srcDoc={selectedTemplate.body}
                                                    className="w-full min-h-[350px] rounded-xl bg-white border-none"
                                                    sandbox="allow-same-origin"
                                                />
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2 font-medium">
                                            Variables: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{'{{customerName}}'}</code>{' '}
                                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{'{{orderId}}'}</code>{' '}
                                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{'{{amount}}'}</code>{' '}
                                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{'{{name}}'}</code>{' '}
                                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{'{{email}}'}</code>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-[32px] border border-dashed border-gray-200 h-[500px] flex items-center justify-center flex-col text-gray-400">
                                <Mail className="w-16 h-16 mb-4 text-gray-200" />
                                <p className="font-black uppercase text-xs tracking-widest">Select a template to edit</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ---- SMTP TAB ---- */}
            {activeTab === 'smtp' && (
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="font-black text-gray-900 uppercase text-xs tracking-widest flex items-center gap-2">
                            <Server className="w-4 h-4 text-blue-600" /> SMTP Server Configuration
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Mail server settings for sending automated emails</p>
                    </div>
                    <form onSubmit={handleSaveSmtp} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SMTP Host</label>
                                <input type="text" value={smtpSettings.smtp_host} onChange={e => setSmtpSettings({ ...smtpSettings, smtp_host: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" placeholder="smtp.gmail.com" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SMTP Port</label>
                                <input type="text" value={smtpSettings.smtp_port} onChange={e => setSmtpSettings({ ...smtpSettings, smtp_port: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" placeholder="587" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SMTP Username</label>
                                <input type="text" value={smtpSettings.smtp_user} onChange={e => setSmtpSettings({ ...smtpSettings, smtp_user: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" placeholder="noreply@emission.in" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SMTP Password</label>
                                <input type="password" value={smtpSettings.smtp_pass} onChange={e => setSmtpSettings({ ...smtpSettings, smtp_pass: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" placeholder="••••••••••••" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">From Email Address</label>
                                <input type="text" value={smtpSettings.smtp_from} onChange={e => setSmtpSettings({ ...smtpSettings, smtp_from: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" placeholder='Emission Orders <orders@emission.in>' />
                            </div>
                        </div>
                        <button type="submit" disabled={saving} className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50">
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </form>
                </div>
            )}

            {/* Create New Template Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-xl p-8 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">New Template</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-black transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTemplate} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Template Type / Key</label>
                                <input
                                    type="text"
                                    required
                                    title="Template Type"
                                    placeholder="e.g. shipping_update"
                                    value={newTemplate.type}
                                    onChange={e => setNewTemplate({ ...newTemplate, type: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Lowercase, underscores only (e.g. shipping_update)</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Subject</label>
                                <input
                                    type="text"
                                    required
                                    title="Email Subject"
                                    placeholder="Your order has been shipped!"
                                    value={newTemplate.subject}
                                    onChange={e => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">HTML Body</label>
                                <textarea
                                    title="HTML Body"
                                    placeholder="Enter HTML..."
                                    rows={10}
                                    value={newTemplate.body}
                                    onChange={e => setNewTemplate({ ...newTemplate, body: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-mono text-xs focus:ring-2 focus:ring-blue-500/10 outline-none resize-none"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={newTemplate.active} onChange={e => setNewTemplate({ ...newTemplate, active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-black" />
                                <span className="text-sm font-bold text-gray-700">Active</span>
                            </label>
                            <button type="submit" disabled={saving} className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {saving ? 'Creating...' : 'Create Template'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
