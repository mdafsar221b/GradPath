import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-gray-100 rounded-2xl shadow-sm ${onClick ? 'cursor-pointer hover:border-blue-100 hover:shadow-md transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`p-5 border-b border-gray-50 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);
