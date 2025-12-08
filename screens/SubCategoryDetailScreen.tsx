
import React from 'react';
import { Place, SubCategoryData } from '../types';
import { ArrowLeft, Star, MapPin, ChevronRight, Search } from 'lucide-react';

interface SubCategoryDetailScreenProps {
  subCategoryId: string | null;
  onBack: () => void;
  onPlaceSelect: (id: string) => void;
  subCategories: SubCategoryData[];
  places: Place[];
}

export const SubCategoryDetailScreen: React.FC<SubCategoryDetailScreenProps> = ({ 
  subCategoryId, 
  onBack, 
  onPlaceSelect,
  subCategories,
  places
}) => {
  const subCategory = subCategories.find(s => s.id === subCategoryId);
  const filteredPlaces = places.filter(p => p.subCategoryId === subCategoryId);

  if (!subCategory) return null;

  return (
    <div className="bg-slate-100 min-h-full flex flex-col pb-20">
      {/* Smaller Header */}
      <div className="relative h-48 flex-shrink-0 shadow-lg z-20">
        <img 
          src={subCategory.image} 
          alt={subCategory.title} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        
        <button 
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={onBack}
          className="absolute top-12 left-6 bg-white/20 backdrop-blur-md border border-white/30 text-white p-2 rounded-full hover:bg-white/30 transition-colors z-20"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute bottom-4 left-6 z-20">
          <h1 className="text-2xl font-black text-white leading-tight drop-shadow-md">
            {subCategory.title}
          </h1>
          <span className="text-orange-200 text-xs font-bold bg-white/10 px-2 py-1 rounded mt-1 inline-block backdrop-blur-sm border border-white/10">{filteredPlaces.length} Mekan Listeleniyor</span>
        </div>
      </div>

      {/* Places List */}
      <div className="flex-1 px-5 pt-4 pb-6 space-y-4">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <div 
              key={place.id}
              onMouseDown={(e) => e.stopPropagation()} 
              onClick={() => onPlaceSelect(place.id)}
              className="bg-white p-3 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-slate-100 flex space-x-4 active:scale-[0.98] transition-transform duration-200 cursor-pointer"
            >
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src={place.image} 
                  alt={place.title}
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center py-1">
                <div className="flex justify-between items-start">
                   <div className="flex items-center space-x-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    <Star size={10} className="text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-bold text-slate-700">{place.rating}</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight mt-1">
                  {place.title}
                </h3>
                <div className="flex items-center text-slate-400 mt-auto">
                  <MapPin size={12} className="mr-1" />
                  <span className="text-[11px] truncate w-32 font-medium">{place.location}</span>
                </div>
              </div>
              <div className="flex items-center justify-center text-gray-300 border-l border-dashed border-gray-100 pl-2">
                <ChevronRight size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 flex flex-col items-center">
            <Search size={32} className="mb-2 opacity-50" />
            <p>Bu kategoride henüz mekan eklenmemiş.</p>
          </div>
        )}
      </div>
    </div>
  );
};
