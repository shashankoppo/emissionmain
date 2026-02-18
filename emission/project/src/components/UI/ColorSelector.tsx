import { Check } from 'lucide-react';

interface ColorOption {
    name: string;
    value: string;
    hexCode?: string;
}

interface ColorSelectorProps {
    colors: ColorOption[];
    selectedColor: string | null;
    onColorSelect: (color: string) => void;
    availableColors?: string[];
    className?: string;
}

export default function ColorSelector({
    colors,
    selectedColor,
    onColorSelect,
    availableColors,
    className = '',
}: ColorSelectorProps) {
    const getColorStyle = (hexCode?: string, colorName?: string) => {
        if (hexCode) return { backgroundColor: hexCode };

        // Default color mappings
        const colorMap: Record<string, string> = {
            black: '#000000',
            white: '#FFFFFF',
            navy: '#001F3F',
            red: '#FF4136',
            blue: '#0074D9',
            green: '#2ECC40',
            yellow: '#FFDC00',
            gray: '#AAAAAA',
            grey: '#AAAAAA',
            orange: '#FF851B',
            purple: '#B10DC9',
            maroon: '#85144B',
        };

        const normalizedName = colorName?.toLowerCase() || '';
        return { backgroundColor: colorMap[normalizedName] || '#CCCCCC' };
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-black mb-3">
                Select Color <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                    const isAvailable = !availableColors || availableColors.includes(color.value);
                    const isSelected = selectedColor === color.value;

                    return (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() => isAvailable && onColorSelect(color.value)}
                            disabled={!isAvailable}
                            className={`
                group relative flex flex-col items-center gap-2 transition-all
                ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
                            title={color.name}
                        >
                            <div
                                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected
                                        ? 'border-black ring-2 ring-black ring-offset-2'
                                        : isAvailable
                                            ? 'border-gray-300 group-hover:border-black'
                                            : 'border-gray-200'
                                    }
                  ${color.name.toLowerCase() === 'white' ? 'shadow-sm' : ''}
                `}
                                style={getColorStyle(color.hexCode, color.name)}
                            >
                                {isSelected && (
                                    <Check
                                        className={`w-5 h-5 ${color.name.toLowerCase() === 'white' ||
                                                color.name.toLowerCase() === 'yellow'
                                                ? 'text-black'
                                                : 'text-white'
                                            }`}
                                    />
                                )}
                                {!isAvailable && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-0.5 bg-gray-400 rotate-45" />
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-700 font-medium">{color.name}</span>
                        </button>
                    );
                })}
            </div>
            {!selectedColor && (
                <p className="text-xs text-gray-500 mt-2">Please select a color to continue</p>
            )}
        </div>
    );
}
