
import React, { useRef, useState } from 'react';
import { CategoryData } from '../types';

interface HorizontalScrollSliderProps {
  activeCategory: string | null;
  onCategorySelect: (e: React.MouseEvent, id: string) => void;
  categories: CategoryData[];
}

export const HorizontalScrollSlider: React.FC<HorizontalScrollSliderProps> = ({ 
  activeCategory, 
  onCategorySelect,
  categories
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-transparent pb-2 pt-2 relative z-40">
      <div 
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="flex overflow-x-auto no-scrollbar px-4 space-x-3 py-2 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden" 
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat, index) => (
          <div 
            key={index}
            onClick={(e) => !isDragging && onCategorySelect(e, cat.id)}
            className={`flex-shrink-0 w-[85px] h-[85px] flex flex-col items-center justify-center rounded-2xl transition-all duration-300 border cursor-pointer select-none
              ${activeCategory === cat.id 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-200 border-transparent transform scale-105' 
                : 'bg-white text-gray-500 border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:border-orange-200 hover:text-orange-600'}`}
          >
            <cat.icon size={26} className={`mb-2 ${activeCategory === cat.id ? 'text-white' : 'text-orange-500'}`} />
            <span className="text-[10px] font-bold text-center leading-tight whitespace-pre-wrap">
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
