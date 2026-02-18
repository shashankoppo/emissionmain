import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200 flex items-center justify-center';

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:hover:bg-gray-400',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
    outline: 'border-2 border-black text-black hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      {children}
    </button>
  );
}
