import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: string;
    variant?: 'primary' | 'outline' | 'ghost';
}

export const Button = ({ children, icon, className, variant = 'primary', ...props }: ButtonProps) => {
    const variants = {
        primary: "w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 py-5 text-lg",
        outline: "bg-transparent border border-white/10 hover:bg-white/5 text-white py-3 px-6",
        ghost: "bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border-transparent py-2 px-2"
    };

    return (
        <button
            className={cn(
                "font-bold rounded-lg tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3",
                variants[variant],
                className
            )}
            {...props}
        >
            {icon && <span className="material-symbols-outlined">{icon}</span>}
            {children}
        </button>
    );
};
