import { X } from 'lucide-react';

interface SizeChartProps {
    isOpen: boolean;
    onClose: () => void;
    category: 'sportswear' | 'medicalwear' | string;
}

export default function SizeChart({ isOpen, onClose, category }: SizeChartProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold">Size Guide - {category === 'medicalwear' ? 'Medical Wear' : 'Sportswear'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-6">
                        All measurements are in inches. For the best fit, measure your chest/bust keeping the tape loose.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 font-bold border-b text-left">Size</th>
                                    <th className="py-3 px-4 font-bold border-b">Chest</th>
                                    <th className="py-3 px-4 font-bold border-b">Waist</th>
                                    <th className="py-3 px-4 font-bold border-b">Length</th>
                                    <th className="py-3 px-4 font-bold border-b">Shoulder</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3 px-4 font-bold text-left">XS</td>
                                    <td className="py-3 px-4">34-36</td>
                                    <td className="py-3 px-4">28-30</td>
                                    <td className="py-3 px-4">26</td>
                                    <td className="py-3 px-4">16.5</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-left">S</td>
                                    <td className="py-3 px-4">36-38</td>
                                    <td className="py-3 px-4">30-32</td>
                                    <td className="py-3 px-4">27</td>
                                    <td className="py-3 px-4">17</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-left">M</td>
                                    <td className="py-3 px-4">38-40</td>
                                    <td className="py-3 px-4">32-34</td>
                                    <td className="py-3 px-4">28</td>
                                    <td className="py-3 px-4">17.5</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-left">L</td>
                                    <td className="py-3 px-4">40-42</td>
                                    <td className="py-3 px-4">34-36</td>
                                    <td className="py-3 px-4">29</td>
                                    <td className="py-3 px-4">18</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-left">XL</td>
                                    <td className="py-3 px-4">42-44</td>
                                    <td className="py-3 px-4">36-38</td>
                                    <td className="py-3 px-4">30</td>
                                    <td className="py-3 px-4">18.5</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-left">XXL</td>
                                    <td className="py-3 px-4">44-46</td>
                                    <td className="py-3 px-4">38-40</td>
                                    <td className="py-3 px-4">31</td>
                                    <td className="py-3 px-4">19</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 bg-gray-50 rounded-xl p-6">
                        <h3 className="font-bold mb-2">How to Measure</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                            <li><strong>Chest:</strong> Measure around the fullest part of your chest.</li>
                            <li><strong>Waist:</strong> Measure at the narrowest part of your waistline.</li>
                            <li><strong>Shoulder:</strong> Measure from one shoulder tip to the other across the back.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
