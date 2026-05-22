import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => (
    <div className={`bg-white border border-zinc-200 rounded-xl ${className}`} {...props}>
        {children}
    </div>
);

export default Card;
