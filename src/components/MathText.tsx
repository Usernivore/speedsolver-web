import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';

interface MathTextProps {
    text: string;
    className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className }) => {
    // Split text by $$...$$ (block math) or $...$ (inline math)
    // We use a regex that captures the delimiters to keep them in the split result
    // The 's' flag allows the dot to match newlines
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/gs);

    return (
        <div className={className} style={{ display: 'contents' }}>
            {parts.map((part, index) => {
                if (part.startsWith('$$') && part.endsWith('$$')) {
                    const math = part.slice(2, -2);
                    return <BlockMath key={index} math={math} />;
                } else if (part.startsWith('$') && part.endsWith('$')) {
                    const math = part.slice(1, -1);
                    return <InlineMath key={index} math={math} />;
                }

                // If the part is empty or just whitespace, skip ReactMarkdown for performance
                if (!part.trim()) return <span key={index}>{part}</span>;

                // Render Markdown for non-math text
                return (
                    <ReactMarkdown
                        key={index}
                        components={{
                            p: ({ children }) => <span className="inline-block mb-1 last:mb-0">{children}</span>,
                            ul: ({ children }) => <ul className="list-disc ml-6 my-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-6 my-2">{children}</ol>,
                        }}
                    >
                        {part}
                    </ReactMarkdown>
                );
            })}
        </div>
    );
};
