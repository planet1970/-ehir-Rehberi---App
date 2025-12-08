
import React from 'react';

interface NavIconProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export const NavIcon: React.FC<NavIconProps> = ({ icon, label, active }) => {
  return (
    <div className={`flex flex-col items-center space-y-1 ${active ? 'text-orange-600' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
};
