
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      image: "https://www.trakyacityhotel.com/wp-content/uploads/2014/01/selimiye-camii.jpg",
      title: "Tarihin Başkenti",
      description: "Osmanlı'nın görkemli mirasını, Mimar Sinan'ın ustalık eserlerini ve şehrin ruhunu keşfet.",
    },
    {
      image: "https://www.evdeborek.com/upload/resimler/haber/edirnetavacigeri3.JPG", 
      title: "Eşsiz Lezzetler",
      description: "Meşhur Edirne tava ciğerinden badem ezmesine, damağınızda iz bırakacak tatlar sizi bekliyor.",
    },
    {
      image: "https://www.turkiyesehirrehberi.org/wp-content/uploads/2020/12/meric-nehri-edirne.jpg",
      title: "Keşfetmeye Başla",
      description: "Edirne'nin saklı kalmış güzelliklerini ve popüler mekanlarını hemen incelemeye başla.",
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="h-full relative bg-slate-900 text-white flex flex-col">
      {/* Background Image with Transition */}
      {steps.map((s, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === step ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
      ))}

      {/* Skip Button */}
      <div className="absolute top-12 right-6 z-20">
        <button 
          onClick={onFinish}
          className="text-white/70 text-sm font-medium hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
        >
          Atla
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-end px-8 pb-12 z-10 relative">
        
        {/* Text Content */}
        <div className="mb-8 min-h-[140px]">
          <h2 className="text-4xl font-black mb-4 leading-tight drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 key={step}">
            {steps[step].title}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 key={step}-desc">
            {steps[step].description}
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="flex space-x-2 mb-8">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === step ? 'w-8 bg-orange-500' : 'w-2 bg-white/30'}`}
            ></div>
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleNext}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 group"
        >
          <span>{step === steps.length - 1 ? 'Başlayalım' : 'Devam Et'}</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};
