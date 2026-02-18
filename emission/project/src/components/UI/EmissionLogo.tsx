interface EmissionLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'black' | 'white';
    className?: string;
}

export default function EmissionLogo({ size = 'md', color = 'black', className = '' }: EmissionLogoProps) {
    const sizeMap = {
        sm: { fontSize: '1.25rem' },
        md: { fontSize: '1.75rem' },
        lg: { fontSize: '2.5rem' },
        xl: { fontSize: '3.5rem' },
    };

    const config = sizeMap[size];
    const textColor = color === 'black' ? '#000' : '#fff';

    return (
        <span
            className={`inline-flex items-baseline ${className}`}
            style={{
                fontFamily: "'Lexend', sans-serif",
                fontSize: config.fontSize,
                color: textColor,
                letterSpacing: '-0.04em',
                fontWeight: 600
            }}
            aria-label="emission"
        >
            emissíon
        </span>
    );
}
