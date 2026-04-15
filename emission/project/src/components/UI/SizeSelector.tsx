import { Check } from 'lucide-react';

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string | null;
    onSizeSelect: (size: string) => void;
    availableSizes?: string[]; // These are sizes with stock > 0
    className?: string;
}

const ALL_POSSIBLE_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];

export default function SizeSelector({
    sizes,
    selectedSize,
    onSizeSelect,
    availableSizes = sizes,
    className = '',
}: SizeSelectorProps) {
    // Determine which sizes to show:
    // If 'sizes' is provided and contains elements, use it.
    // Otherwise use ALL_POSSIBLE_SIZES.
    const displaySizes = (sizes && sizes.length > 0) ? sizes : ALL_POSSIBLE_SIZES;

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-black uppercase tracking-tight text-black">
                    Select Size <span className="text-red-500">*</span>
                </label>
                {selectedSize && (
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                        Selected: {selectedSize}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-2.5">
                {displaySizes.map((size) => {
                    const isAvailable = availableSizes.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                        <button
                            key={size}
                            type="button"
                            onClick={() => isAvailable && onSizeSelect(size)}
                            className={`
                                relative h-12 min-w-[3.5rem] px-3 border-2 font-black text-xs transition-all duration-300 rounded-xl flex items-center justify-center
                                ${isSelected
                                    ? 'border-black bg-black text-white shadow-lg shadow-black/10 scale-105'
                                    : isAvailable
                                        ? 'border-gray-100 bg-white text-gray-900 hover:border-black hover:scale-105'
                                        : 'border-gray-50 bg-gray-50/50 text-gray-300 cursor-not-allowed grayscale'
                                }
                            `}
                        >
                            {size}
                            {!isAvailable && (
                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl">
                                    <div className="w-[140%] h-[1px] bg-gray-300 -rotate-45" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            {!selectedSize && (
                <p className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-widest animate-pulse">
                    Please select your fit to continue
                </p>
            )}
        </div>
    );
}
