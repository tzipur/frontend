import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...props }, ref) => {
    const baseClasses = "transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-center";
    
    const sizeClasses = {
      sm: "py-[clamp(0.5rem,1.5dvh,0.75rem)] px-4 rounded-xl font-bold text-[clamp(0.875rem,2dvh,1rem)]",
      md: "py-[clamp(0.75rem,2dvh,1rem)] px-6 rounded-2xl font-bold text-[clamp(1rem,2.5dvh,1.125rem)]",
      lg: "py-[clamp(1rem,2.5dvh,1.25rem)] px-8 rounded-2xl font-bold text-lg",
    }[size];
    // Using standard colors from the app.
    // primary: Sky blue
    // secondary: White with sky blue text/border or transparent bg
    // destructive: Red
    const variantClasses = {
      primary: "bg-[#5B93B5] text-white shadow-md hover:shadow-lg hover:bg-[#4A7A9A] border border-transparent",
      secondary: "bg-white text-[#5B93B5] border-2 border-[#5B93B5]/20 hover:bg-[#5B93B5]/5 shadow-sm",
      ghost: "bg-transparent text-[#5B93B5] hover:bg-[#5B93B5]/10 border border-transparent",
      destructive: "bg-red-500 text-white shadow-md hover:shadow-lg hover:bg-red-600 border border-transparent",
    }[variant];
    
    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button ref={ref} className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
