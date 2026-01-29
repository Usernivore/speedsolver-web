import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: string;
}

export const Button = ({ children, icon, className, ...props }: ButtonProps) => {
    return (
        <button
            className={cn(
                "w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-lg text-lg tracking-widest transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-3",
                className
            )}
            {...props}
        >
            {icon && <span className="material-symbols-outlined">{icon}</span>}
            {children}
        </button>
    );
};
