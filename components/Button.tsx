import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-serif tracking-wider transition-all duration-300 uppercase text-sm md:text-base border";
  
  const variants = {
    primary: "bg-red-900/80 border-red-900 text-red-100 hover:bg-red-800 hover:border-red-700 shadow-[0_0_15px_rgba(153,27,27,0.3)] disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </span>
      ) : children}
    </button>
  );
};