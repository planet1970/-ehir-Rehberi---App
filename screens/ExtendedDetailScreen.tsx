
import React, { useState, useEffect } from 'react';
import { Place } from '../types';
import { ArrowLeft, Volume2, StopCircle, Clock, Ticket, Coffee, ChefHat, Grid, Utensils, Feather } from 'lucide-react';

interface ExtendedDetailScreenProps {
  placeId: string | null;
  onBack: () => void;
  places: Place[];
}

export const ExtendedDetailScreen: React.FC<ExtendedDetailScreenProps> = ({ 
  placeId, 
  onBack,
  places
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const place = places.find(p => p.id === placeId);
  
  // Ensure voices are loaded (some browsers load async)
  useEffect(() => {
     if ('speechSynthesis' in window) {
         window.speechSynthesis.getVoices();
     }
     return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  
  if (!place) return null;

  const isFoodPlace = place.category === 'Yeme & İçme';

  // TTS Functionality
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        // Construct the full text to read
        const textToRead = `
          ${place.title}.
          ${place.history ? (isFoodPlace ? 'Hikayemiz. ' : 'Tarihçe. ') + place.history : ''}
          ${place.architecture ? (isFoodPlace ? 'Lezzet Sırları. ' : 'Mimari Özellikler. ') + place.architecture : ''}
          ${place.legends ? (isFoodPlace ? 'Menüden Seçmeler. ' : 'Efsaneler. ') + place.legends : ''}
        `;

        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        // Try to find a Turkish Female Voice
        const voices = window.speechSynthesis.getVoices();
        // Priority: Turkish Female -> Any Turkish -> Default
        const trVoice = voices.find(v => v.lang.includes('tr') && (v.name.includes('Female') || v.name.includes('Kadın') || v.name.includes('Yelda'))) || 
                        voices.find(v => v.lang.includes('tr'));
                        
        if (trVoice) {
            utterance.voice = trVoice;
        }

        utterance.lang = 'tr-TR'; 
        utterance.rate = 0.9; 
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      alert("Tarayıcınız sesli okumayı desteklemiyor.");
    }
  };

  return (
    <div className="bg-white min-h-full pb-20">
      {/* Sticky Header with Background */}
      <div className="sticky top-0 bg-slate-900 text-white shadow-md z-50 px-6 py-4 flex items-center justify-between">
        <button 
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={() => { window.speechSynthesis.cancel(); onBack(); }}
          className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors ring-1 ring-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold text-sm truncate max-w-[150px] tracking-wide">{place.title}</span>
        
        {/* TTS Button (More Visible) */}
        <button
          onClick={handleSpeak}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg ${
              isSpeaking 
              ? 'bg-red-500 text-white animate-pulse shadow-red-500/40' 
              : 'bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/40'
          }`}
        >
          {isSpeaking ? <StopCircle size={16} /> : <Volume2 size={16} />}
          <span>{isSpeaking ? 'Durdur' : 'Sesli Dinle'}</span>
        </button>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Title Area */}
        <div className="relative">
          <div className="absolute -left-6 top-0 bottom-0 w-2 bg-orange-500 rounded-r-full shadow-sm"></div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">{place.title}</h1>
          <div className="w-full h-px bg-gray-200 mt-4"></div>
        </div>

         {/* Visiting Info - RESTRUCTURED: Compact Height */}
         <div className="bg-orange-50/60 p-2.5 rounded-xl border border-orange-100/50 shadow-sm flex flex-row items-center justify-between gap-4">
            <h3 className="text-[10px] font-bold text-orange-900/50 uppercase tracking-widest hidden sm:block pl-2">
              {isFoodPlace ? 'Açık' : 'Ziyaret'}
            </h3>
            <div className="flex-1 flex items-center justify-start gap-4">
              {place.visitingHours && (
                <div className="flex items-center text-xs font-semibold text-slate-700">
                  <Clock size={14} className="text-orange-500 mr-1.5" />
                  <span>{place.visitingHours}</span>
                </div>
              )}
               {place.entranceFee && (
                <div className="flex items-center text-xs font-semibold text-slate-700">
                  <Ticket size={14} className="text-orange-500 mr-1.5" />
                  <span>{place.entranceFee}</span>
                </div>
              )}
            </div>
         </div>

        {/* History / About Section */}
        {place.history && (
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-3 text-slate-800">
              {isFoodPlace ? <Coffee size={20} className="text-orange-500" /> : <Clock size={20} className="text-orange-500" />}
              <h2 className="text-xl font-bold">{isFoodPlace ? 'Hikayemiz' : 'Tarihçe'}</h2>
            </div>
            <p className="text-slate-600 leading-7 text-base text-justify">
              {place.history}
            </p>
          </div>
        )}

        {/* Architecture / Cuisine Secrets Section */}
        {place.architecture && (
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center space-x-2 mb-3 text-slate-800">
              {isFoodPlace ? <ChefHat size={20} className="text-orange-500" /> : <Grid size={20} className="text-orange-500" />}
              <h2 className="text-xl font-bold">{isFoodPlace ? 'Lezzet Sırları' : 'Mimari Özellikler'}</h2>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
               <p className="text-slate-600 leading-7 text-base text-justify italic">
                "{place.architecture}"
               </p>
            </div>
          </div>
        )}

        {/* Legends / Menu Section */}
        {place.legends && (
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-2 mb-3 text-slate-800">
              {isFoodPlace ? <Utensils size={20} className="text-purple-500" /> : <Feather size={20} className="text-purple-500" />}
              <h2 className="text-xl font-bold text-purple-900">{isFoodPlace ? 'Menüden Seçmeler' : 'Efsaneler & Hikayeler'}</h2>
            </div>
            <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
              <p className="text-purple-800 leading-7 text-base text-justify font-medium">
                {place.legends}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
