'use client';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
}

export function Card({ children, className = "", title, action }: CardProps) {
    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
