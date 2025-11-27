import React from 'react';

/**
 * Reusable Button Component with variants
 */
const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'md',
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-black transition-all duration-300 transform relative overflow-hidden rounded-xl';
  
  const variantClasses = {
    primary: 'button-premium text-gray-900',
    secondary: 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 text-white border-2 border-gray-500/50',
    danger: 'bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-800 hover:via-red-700 hover:to-red-800 text-white border-2 border-red-500/50 shadow-red-900/50',
    success: 'bg-gradient-to-r from-green-700 via-green-600 to-green-700 hover:from-green-800 hover:via-green-700 hover:to-green-800 text-white border-2 border-green-500/50',
    disabled: 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed border-2 border-gray-600'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const variantClass = disabled ? variantClasses.disabled : variantClasses[variant] || variantClasses.primary;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClass} ${className} ${
        !disabled ? 'hover:scale-105 active:scale-95' : ''
      }`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      )}
    </button>
  );
};

export default Button;

