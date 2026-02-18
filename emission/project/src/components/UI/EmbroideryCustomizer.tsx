import { useState } from 'react';
import { Type, Palette } from 'lucide-react';
import { EmbroideryCustomization } from '../../types';

interface EmbroideryCustomizerProps {
    onCustomizationChange: (customization: EmbroideryCustomization | null) => void;
    price: number;
    className?: string;
}

const POSITIONS = [
    { value: 'left-chest', label: 'Left Chest' },
    { value: 'right-chest', label: 'Right Chest' },
    { value: 'back', label: 'Back' },
    { value: 'sleeves', label: 'Sleeves' },
];

const THREAD_COLORS = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Navy', value: 'navy', hex: '#001F3F' },
    { name: 'Red', value: 'red', hex: '#FF4136' },
    { name: 'Gold', value: 'gold', hex: '#FFD700' },
    { name: 'Silver', value: 'silver', hex: '#C0C0C0' },
];

const FONT_STYLES = [
    { value: 'standard', label: 'Standard' },
    { value: 'script', label: 'Script' },
    { value: 'bold', label: 'Bold' },
    { value: 'italic', label: 'Italic' },
];

export default function EmbroideryCustomizer({
    onCustomizationChange,
    price,
    className = '',
}: EmbroideryCustomizerProps) {
    const [enabled, setEnabled] = useState(false);
    const [text, setText] = useState('');
    const [position, setPosition] = useState('left-chest');
    const [fontStyle, setFontStyle] = useState('standard');
    const [threadColor, setThreadColor] = useState('black');

    const MAX_CHARS = 20;

    const handleToggle = (checked: boolean) => {
        setEnabled(checked);
        if (!checked) {
            onCustomizationChange(null);
            setText('');
        } else if (text.trim()) {
            onCustomizationChange({ text, position, fontStyle, threadColor });
        }
    };

    const handleTextChange = (value: string) => {
        if (value.length <= MAX_CHARS) {
            setText(value);
            if (enabled && value.trim()) {
                onCustomizationChange({ text: value, position, fontStyle, threadColor });
            } else if (enabled && !value.trim()) {
                onCustomizationChange(null);
            }
        }
    };

    const handlePositionChange = (value: string) => {
        setPosition(value);
        if (enabled && text.trim()) {
            onCustomizationChange({ text, position: value, fontStyle, threadColor });
        }
    };

    const handleFontChange = (value: string) => {
        setFontStyle(value);
        if (enabled && text.trim()) {
            onCustomizationChange({ text, position, fontStyle: value, threadColor });
        }
    };

    const handleColorChange = (value: string) => {
        setThreadColor(value);
        if (enabled && text.trim()) {
            onCustomizationChange({ text, position, fontStyle, threadColor: value });
        }
    };

    return (
        <div className={`border border-gray-200 p-6 bg-gray-50 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Type className="w-5 h-5 text-black" />
                    <h3 className="font-semibold text-black">Custom Embroidery</h3>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => handleToggle(e.target.checked)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">Add Embroidery (+₹{price})</span>
                </label>
            </div>

            {enabled && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Embroidery Text <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => handleTextChange(e.target.value)}
                            placeholder="Enter text (max 20 characters)"
                            className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                            maxLength={MAX_CHARS}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {text.length}/{MAX_CHARS} characters
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Position</label>
                        <div className="grid grid-cols-2 gap-2">
                            {POSITIONS.map((pos) => (
                                <button
                                    key={pos.value}
                                    type="button"
                                    onClick={() => handlePositionChange(pos.value)}
                                    className={`px-4 py-2 text-sm border-2 transition-colors ${position === pos.value
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-300 bg-white text-black hover:border-black'
                                        }`}
                                >
                                    {pos.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Font Style</label>
                        <select
                            value={fontStyle}
                            onChange={(e) => handleFontChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                        >
                            {FONT_STYLES.map((style) => (
                                <option key={style.value} value={style.value}>
                                    {style.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            <Palette className="w-4 h-4 inline mr-1" />
                            Thread Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {THREAD_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => handleColorChange(color.value)}
                                    className={`flex flex-col items-center gap-1 p-2 border-2 rounded transition-colors ${threadColor === color.value
                                            ? 'border-black'
                                            : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                    title={color.name}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full border ${color.value === 'white' ? 'border-gray-300' : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <span className="text-xs text-gray-700">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {text.trim() && (
                        <div className="bg-white p-4 border border-gray-200 mt-4">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <p className="text-black font-medium">
                                "{text}" on {POSITIONS.find((p) => p.value === position)?.label} in{' '}
                                {THREAD_COLORS.find((c) => c.value === threadColor)?.name} thread
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
