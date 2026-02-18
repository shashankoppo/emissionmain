import { Check } from 'lucide-react';

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string | null;
    onSizeSelect: (size: string) => void;
    availableSizes?: string[];
    className?: string;
}

export default function SizeSelector({
    sizes,
    selectedSize,
    onSizeSelect,
    availableSizes = sizes,
    className = '',
}: SizeSelectorProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-black mb-3">
                Select Size <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                    const isAvailable = availableSizes.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                        <button
                            key={size}
                            type="button"
                            onClick={() => isAvailable && onSizeSelect(size)}
                            disabled={!isAvailable}
                            className={`
                relative px-4 py-2 min-w-[60px] border-2 font-medium text-sm transition-all
                ${isSelected
                                    ? 'border-black bg-black text-white'
                                    : isAvailable
                                        ? 'border-gray-300 bg-white text-black hover:border-black'
                                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
              `}
                        >
                            {size}
                            {isSelected && (
                                <Check className="absolute top-1 right-1 w-3 h-3" />
                            )}
                            {!isAvailable && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-0.5 bg-gray-400 rotate-45" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            {!selectedSize && (
                <p className="text-xs text-gray-500 mt-2">Please select a size to continue</p>
            )}
        </div>
    );
}
