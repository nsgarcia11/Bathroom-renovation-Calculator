import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  cost?: number;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  icon,
  cost,
  onClick,
}) => {
  const baseClasses =
    'bg-white rounded-lg shadow-sm border border-slate-200 p-0';
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:shadow-md transition-shadow'
    : '';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-3'>
            {icon && <div className='p-2 bg-slate-100 rounded-lg'>{icon}</div>}
            <h3 className='font-semibold text-md text-slate-800'>{title}</h3>
          </div>
          {cost !== undefined && (
            <span className='font-bold text-slate-800 text-sm'>
              ${cost.toFixed(2)}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-3 py-4 border-b border-slate-200 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-3 py-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-slate-800 ${className}`}>
    {children}
  </h3>
);

export const DashboardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}> = ({ icon, title, value, color }) => (
  <div className='bg-white p-4 rounded-xl shadow-sm flex-1'>
    <div className='flex items-center justify-between'>
      <div className={`p-2 inline-block rounded-full ${color}`}>{icon}</div>
      <p className='text-2xl font-bold text-slate-800'>{value}</p>
    </div>
    <p className='text-sm text-slate-500 mt-2'>{title}</p>
  </div>
);
