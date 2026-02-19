import { MapPin, Truck, CheckCircle } from 'lucide-react';

export default function PincodeChecker() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50 mb-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-black uppercase tracking-widest">Domestic Shipping</span>
                        <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                    <h3 className="text-lg font-black text-blue-900 tracking-tight">Pan-India Delivery</h3>
                    <p className="text-sm text-blue-700/70 mt-1 leading-relaxed">
                        We offer complimentary express shipping on all domestic orders. No hidden charges.
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>All pincodes served across India</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200/30 flex items-center gap-3">
                <MapPin className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Jabalpur Factory Dispatch</span>
            </div>
        </div>
    );
}
