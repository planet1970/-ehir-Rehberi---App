
import React from 'react';

interface InfoCardProps {
  label: string;
  value: string | undefined;
  icon: React.ElementType;
}

export const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon: Icon }) => {
  if (!value) return null;
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_8px_15px_rgba(0,0,0,0.08)] flex items-center space-x-3 h-full">
      <div className="bg-orange-50 p-2.5 rounded-full shadow-inner flex-shrink-0">
        <Icon size={18} className="text-orange-600" />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
};
