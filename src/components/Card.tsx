import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className }: CardProps) => {
    return (
        <div
            className={cn(
                "w-full max-w-4xl bg-[#1E1E1E] rounded-2xl border border-white/5 shadow-2xl p-8",
                className
            )}
        >
            {children}
        </div>
    );
};
