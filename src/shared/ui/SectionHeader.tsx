import React from 'react';

interface SectionHeaderProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children, action }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-900">
        {children}
      </h3>
      {action}
    </div>
  );
};
