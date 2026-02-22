import { useState, useEffect } from 'react';
import api from '../lib/api';
import { FileText, Download, Printer, Search, Eye, Filter, MoreVertical, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalAmount: string;
    status: string;
    createdAt: string;
    invoiceId: string;
    source: string;
    items: string;
}

export default function Invoices() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [template, setTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        Promise.all([fetchOrders(), fetchTemplate()]).finally(() => {
            setLoading(false);
        });
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const fetchTemplate = async () => {
        try {
            const response = await api.get('/invoices/template');
            setTemplate(response.data);
        } catch (error) {
            console.error('Failed to fetch template:', error);
        }
    };

    const exportAllInvoices = () => {
        if (orders.length === 0) return;
        const headers = ['Invoice ID', 'Order ID', 'Customer', 'Email', 'Amount', 'Status', 'Source', 'Date'];
        const rows = orders.map(o => [
            o.invoiceId || o.id.slice(0, 8).toUpperCase(),
            o.id,
            o.customerName,
            o.customerEmail,
            o.totalAmount,
            o.status,
            o.source || 'website',
            new Date(o.createdAt).toLocaleDateString()
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `emission_invoices_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    const filteredOrders = orders.filter(o =>
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.invoiceId && o.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-50 text-green-600';
            case 'pending': return 'bg-orange-50 text-orange-600';
            case 'cancelled': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    const printInvoice = (order: Order) => {
        const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!winPrint) return;

        const currentTemplate = template || {
            companyName: 'EMISSION',
            companyAddress: 'Jabalpur, Madhya Pradesh',
            companyPhone: '+91 0000000000',
            companyEmail: 'support@emission.in',
            terms: 'Thank you for choosing EMISSION. We appreciate your business!',
            primaryColor: '#1a1a1a',
            accentColor: '#3b82f6'
        };

        winPrint.document.write(`
            <html>
                <head>
                    <title>Invoice - ${order.id}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.5; }
                        .header { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 30px; margin-bottom: 30px; }
                        .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; color: ${currentTemplate.primaryColor}; }
                        .accent-bar { width: 40px; height: 4px; background: ${currentTemplate.accentColor}; margin: 10px auto; }
                        .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 40px; }
                        .meta-block h4 { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; margin-top: 0; }
                        .meta-block p { font-weight: 700; font-size: 14px; margin: 0; }
                        table { width: 100%; border-collapse: collapse; }
                        th { text-align: left; padding: 15px; background: #f9f9f9; font-size: 11px; text-transform: uppercase; color: #666; }
                        td { padding: 15px; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600; }
                        .total-row { background: ${currentTemplate.primaryColor}; color: white; }
                        .total-row td { border: none; font-size: 18px; font-weight: 900; }
                        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">${currentTemplate.companyName}</div>
                        <div class="accent-bar"></div>
                        <p style="font-size: 12px; margin-top: 5px; color: #666;">Premium Apparel Solutions</p>
                    </div>
                    <div class="invoice-meta">
                        <div class="meta-block">
                            <h4>Billed To</h4>
                            <p>${order.customerName}</p>
                            <p>${order.customerPhone}</p>
                            <p style="font-size: 12px; color: #666; font-weight: 500;">${order.customerEmail}</p>
                        </div>
                        <div class="meta-block" style="text-align: right;">
                            <h4>Invoice Number</h4>
                            <p>#${order.invoiceId || order.id.slice(0, 8).toUpperCase()}</p>
                            <h4 style="margin-top: 15px;">Date</h4>
                            <p>${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            ${currentTemplate.gstNumber ? `<h4 style="margin-top: 15px;">GSTIN</h4><p>${currentTemplate.gstNumber}</p>` : ''}
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">UnitPrice</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${JSON.parse(order.items || '[]').map((item: any) => `
                                <tr>
                                    <td>
                                        ${item.name || item.product?.name || 'Product'}
                                        ${item.hasEmbroidery ? '<br><span style="font-size: 10px; color: #888; font-weight: 500;">+ Custom Branding Included</span>' : ''}
                                    </td>
                                    <td style="text-align: center;">${item.quantity}</td>
                                    <td style="text-align: right;">₹${(Number(item.price || item.product?.retailPrice || 0)).toLocaleString()}</td>
                                    <td style="text-align: right;">₹${(Number(item.price || item.product?.retailPrice || 0) * item.quantity).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td colspan="3">Total Amount Paid</td>
                                <td style="text-align: right;">₹${Number(order.totalAmount).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <p style="font-size: 10px; color: #999; text-transform: uppercase; font-weight: 900; margin-bottom: 5px;">Payment Status</p>
                            <p style="font-size: 12px; font-weight: 900; color: #059669; text-transform: uppercase; letter-spacing: 1px;">PAID via ${order.source === 'pos' ? 'In-Store POS' : 'Online Gateway'}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 10px; color: #999; text-transform: uppercase; font-weight: 900; margin-bottom: 5px;">Contact</p>
                            <p style="font-size: 10px; font-weight: 700;">${currentTemplate.companyPhone}</p>
                            <p style="font-size: 10px; font-weight: 700;">${currentTemplate.companyEmail}</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>${currentTemplate.terms}</p>
                        <p style="font-size: 8px; margin-top: 20px;">Issued by ${currentTemplate.companyName} - ${currentTemplate.companyAddress}</p>
                    </div>
                </body>
            </html>
        `);
        winPrint.document.close();
        winPrint.focus();
        setTimeout(() => {
            winPrint.print();
            winPrint.close();
        }, 500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Invoices</h1>
                    <p className="text-gray-500 mt-2 font-medium">Digital records and financial statements</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={exportAllInvoices}
                        className="flex items-center gap-3 bg-gray-50 text-gray-900 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Export All
                    </button>
                    <button className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95">
                        <Printer className="w-5 h-5" />
                        Report
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Issued</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{orders.length}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{orders.filter(o => o.status === 'completed' || o.status === 'delivered').length}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                        <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{orders.filter(o => o.status === 'pending').length}</h3>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search by Invoice ID or Customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-16 pr-6 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button title="Filter List" className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"><Filter className="w-5 h-5" /></button>
                        <button title="More Options" className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice / ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-8"><div className="h-4 bg-gray-50 rounded-full w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-black">#{order.invoiceId || order.id.slice(0, 8).toUpperCase()}</span>
                                            <span className={`text-[8px] font-black mt-1 px-1.5 py-0.5 rounded-md w-fit uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900">{order.customerName}</span>
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">{order.source || 'Website'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-base font-black text-black tracking-tighter">₹{Number(order.totalAmount).toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                title="View Digital Invoice"
                                                className="p-3 bg-white border border-gray-100 text-gray-900 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => printInvoice(order)}
                                                title="Print Invoice"
                                                className="p-3 bg-black text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-black/10"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && !loading && (
                    <div className="py-24 text-center">
                        <FileText className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                        <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">No invoices found</p>
                    </div>
                )}
            </div>

            {/* Invoice Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-black uppercase tracking-tight">Invoice Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-black">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-12 bg-gray-50/50">
                            <div className="bg-white p-12 rounded-[32px] shadow-sm border border-gray-100 max-w-3xl mx-auto">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h1 className="text-3xl font-black tracking-tighter text-black">EMISSION</h1>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Premium Retail</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Invoice Number</h3>
                                        <p className="text-xl font-black text-black font-mono">#{selectedOrder.invoiceId || selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 mb-12">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Billed To</h4>
                                        <p className="font-black text-gray-900">{selectedOrder.customerName}</p>
                                        <p className="text-sm font-bold text-gray-500 mt-1">{selectedOrder.customerPhone}</p>
                                        <p className="text-sm font-medium text-gray-400">{selectedOrder.customerEmail}</p>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Date Issued</h4>
                                        <p className="font-black text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                <table className="w-full mb-12">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Description</th>
                                            <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                            <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {JSON.parse(selectedOrder.items || '[]').map((item: any, i: number) => (
                                            <tr key={i}>
                                                <td className="py-6 min-w-[200px]">
                                                    <p className="text-sm font-black text-gray-900">{item.name || item.product?.name || 'Product'}</p>
                                                    {item.hasEmbroidery && <p className="text-[10px] font-bold text-orange-500 mt-1 uppercase tracking-tight">+ Additional Branding Applied</p>}
                                                </td>
                                                <td className="py-6 text-center text-sm font-black text-gray-500">{item.quantity}</td>
                                                <td className="py-6 text-right text-sm font-black text-gray-900">₹{(Number(item.price || item.product?.retailPrice || 0)).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                                    <div>
                                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>
                                            Status: {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                        <p className="text-4xl font-black text-black tracking-tighter">₹{Number(selectedOrder.totalAmount).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 border-t border-gray-50 flex justify-center gap-4 bg-white">
                            <button
                                onClick={() => printInvoice(selectedOrder)}
                                className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10"
                            >
                                <Printer className="w-5 h-5" />
                                Print Now
                            </button>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="flex items-center gap-3 bg-gray-50 text-gray-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
