
import React from 'react';
import { Place } from '../types';
import { InfoCard } from '../components/InfoCard';
import { ArrowLeft, Share2, Star, Armchair, Clock, Flame, User as UserIcon, Calendar, Ticket, BookOpen, ArrowRight, MapPin } from 'lucide-react';

interface DetailScreenProps {
  placeId: string | null;
  onBack: () => void;
  onMoreInfo: () => void;
  places: Place[];
}

export const DetailScreen: React.FC<DetailScreenProps> = ({ 
  placeId, 
  onBack, 
  onMoreInfo,
  places
}) => {
  const place = places.find(p => p.id === placeId);

  if (!place) return null;

  // Check if it's a food place to customize the view
  const isFoodPlace = place.category === 'Yeme & İçme';

  return (
    <div className="relative bg-white min-h-full pb-20">
      {/* Hero Image */}
      <div className="relative h-80">
        <img 
          src={place.image} 
          className="w-full h-full object-cover"
          alt={place.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
        <button 
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={onBack}
          className="absolute top-12 left-6 bg-white/30 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/40 transition-colors border border-white/20 shadow-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onMouseDown={(e) => e.stopPropagation()} 
          className="absolute top-12 right-6 bg-white/30 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/40 transition-colors border border-white/20 shadow-lg"
        >
          <Share2 size={24} />
        </button>
      </div>

      {/* Content Body */}
      <div className="relative -mt-10 bg-white rounded-t-[32px] px-6 pt-10 pb-24 min-h-[500px] shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        {/* Pull Indicator */}
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <span className="text-orange-600 font-bold text-xs uppercase tracking-wider bg-orange-50 px-2 py-1 rounded mb-2 inline-block border border-orange-100">
              {place.category}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              {place.title}
            </h1>
          </div>
          <div className="flex flex-col items-center bg-orange-50 px-3 py-2 rounded-xl border border-orange-100 shadow-sm">
            <Star size={20} className="text-orange-600 fill-orange-600" />
            <span className="text-orange-800 font-bold mt-1 text-sm">{place.rating}</span>
          </div>
        </div>

        {/* Quick Stats Grid - CUSTOMIZED LAYOUTS */}
        <div className="mb-8">
          {isFoodPlace ? (
            // --- FOOD PLACE STATS (2x2 Grid + Full Width) ---
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                 <InfoCard label="Ortam" value={place.atmosphere} icon={Armchair} />
                 <InfoCard label="Saatler" value={place.visitingHours} icon={Clock} />
              </div>
              {/* Full Width Ne Yenir Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_8px_15px_rgba(0,0,0,0.08)] flex flex-col">
                 <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-orange-50 p-2 rounded-full shadow-inner">
                      <Flame size={16} className="text-orange-600" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Ne Yenir?</span>
                 </div>
                 <div className="flex-1">
                   <p className="font-bold text-slate-800 text-sm leading-relaxed">
                     {place.specialty ? place.specialty.split(',').join(', ') : 'Belirtilmemiş'}
                   </p>
                 </div>
              </div>
            </div>
          ) : (
            // --- LANDMARK STATS (2x2 Grid) ---
            <div className="grid grid-cols-2 gap-4">
               <InfoCard label="Mimar" value={place.architect} icon={UserIcon} />
               <InfoCard label="Yapım Yılı" value={place.year} icon={Calendar} />
               <InfoCard label="Saatler" value={place.visitingHours} icon={Clock} />
               <InfoCard label="Giriş" value={place.entranceFee} icon={Ticket} />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-slate-600 leading-relaxed text-base font-medium text-justify">
            {place.description}
          </p>
        </div>

        {/* More Info Button */}
        {(place.history || place.architecture) && (
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMoreInfo}
            className="w-full bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-2xl flex items-center justify-between mb-8 active:scale-[0.98] transition-transform hover:bg-orange-100/50 shadow-md shadow-orange-100/50"
          >
            <div className="flex items-center">
              <BookOpen size={20} className="text-orange-600 mr-3" />
              <div className="text-left">
                <p className="font-bold text-sm">Daha Fazla Bilgi</p>
                <p className="text-[10px] text-orange-600/70">
                  {isFoodPlace ? 'Hikaye, lezzet sırları ve menü' : 'Tarihçe, mimari ve efsaneler'}
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-orange-400" />
          </button>
        )}

        {/* Location Section */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-900 mb-3 text-lg">Konum</h3>
          <div className="bg-slate-100 h-32 rounded-2xl flex items-center justify-center border border-slate-200 relative overflow-hidden shadow-inner">
             {/* Fake Map Pattern */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
             <div className="flex flex-col items-center text-slate-500 z-10 bg-white/90 p-4 rounded-xl backdrop-blur-sm shadow-md">
               <MapPin size={24} className="text-orange-600 mb-1" />
               <span className="text-xs font-bold text-slate-800">{place.location}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Floating Get Directions Button */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <button 
          onMouseDown={(e) => e.stopPropagation()} 
          className="pointer-events-auto bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full shadow-xl shadow-orange-600/40 active:scale-[0.95] transition-transform flex items-center space-x-2 border border-orange-400/20"
        >
          <MapPin size={18} />
          <span>Yol Tarifi Al</span>
        </button>
      </div>
    </div>
  );
};
