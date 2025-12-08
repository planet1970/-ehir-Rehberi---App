
import React, { useState, useEffect } from 'react';
import { Place, CategoryData, SubCategoryData, User } from '../types';
import { HorizontalScrollSlider } from '../components/HorizontalScrollSlider';
import { Search, Menu, X, User as UserIcon, ChevronRight, Settings, LogOut, ArrowRight, LayoutGrid, Star, MapPin, Edit3 } from 'lucide-react';

interface HomeScreenProps {
  onPlaceSelect: (id: string) => void;
  onSubCategorySelect: (id: string) => void;
  scrollY: number;
  categories: CategoryData[];
  subCategories: SubCategoryData[];
  places: Place[];
  user: User | null;
  onProfileClick: () => void;
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onPlaceSelect, 
  onSubCategorySelect,
  scrollY,
  categories,
  subCategories,
  places,
  user,
  onProfileClick,
  onLogout
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Slideshow Images
  const HERO_IMAGES = [
    "https://www.turkiyesehirrehberi.org/wp-content/uploads/2020/12/meric-nehri-edirne.jpg", // Meriç
    "https://www.trakyacityhotel.com/wp-content/uploads/2014/01/selimiye-camii.jpg", // Selimiye
    "https://image.hurimg.com/i/hurriyet/90/770x0/5f215b492269a22dacf9c570.jpg" // Karaağaç
  ];

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000); 
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation(); 
    setActiveCategory(activeCategory === catId ? null : catId);
    setIsMenuOpen(false); 
  };

  // Determine if we should show subcategories
  const shouldShowSubCategories = activeCategory === 'Gezilecek Yerler' || activeCategory === 'Yeme & İçme';

  // Filter places or subcategories
  const filteredPlaces = !activeCategory
    ? places 
    : places.filter(p => p.category === activeCategory); 
    
  // Sort filtered places by rating (descending)
  const sortedPlaces = [...filteredPlaces].sort((a, b) => b.rating - a.rating);

  // Filter subcategories based on active parent category
  const filteredSubCategories = activeCategory 
    ? subCategories.filter(s => s.parentCategoryId === activeCategory)
    : [];

  // --- COLLAPSING HEADER LOGIC ---
  const HEADER_MAX_HEIGHT = 340;
  const HEADER_MIN_HEIGHT = 110;
  
  const currentHeight = Math.max(HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT - scrollY);
  const scrollRatio = Math.min(scrollY / (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT), 1);
  
  const bigContentOpacity = Math.max(0, 1 - (scrollRatio * 2.5));
  const smallContentOpacity = scrollRatio > 0.85 ? 1 : 0;
  
  return (
    <div className="flex flex-col min-h-full relative bg-slate-100">
      
      {/* SIDE MENU (DRAWER) */}
      <>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
        ></div>
        
        {/* Drawer Panel - FIXED LAYOUT */}
        <div 
          className={`absolute top-0 bottom-0 right-0 w-[80%] max-w-[300px] z-[61] bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Drawer Header (Profile) - FIXED */}
          <div className="relative h-48 bg-slate-900 overflow-hidden flex-shrink-0">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
             <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
             
             {/* Content */}
             <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white/20 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl overflow-hidden">
                    {user && user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={32} />
                    )}
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/10 rounded-full text-white/80 hover:bg-white/20 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div>
                   <h2 className="text-white font-bold text-xl leading-tight">
                     {user ? user.name : 'Misafir Kullanıcı'}
                   </h2>
                   <div 
                      onClick={() => { setIsMenuOpen(false); onProfileClick(); }}
                      className="flex items-center mt-1 text-slate-400 text-xs font-medium cursor-pointer hover:text-white transition-colors"
                    >
                      {user ? (
                        <span className="text-green-400 flex items-center gap-1">
                           <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Çevrimiçi
                        </span>
                      ) : (
                        <span>Giriş Yap / Kayıt Ol</span>
                      )}
                      {user && <Edit3 size={12} className="ml-2 text-slate-500" />}
                   </div>
                </div>
             </div>
          </div>

          {/* Drawer Categories List (SCROLLABLE MIDDLE) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Hızlı Erişim</p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={(e) => handleCategoryClick(e, cat.id)}
                className={`w-full flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-200 group ${activeCategory === cat.id ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <cat.icon size={20} className={`transition-colors ${activeCategory === cat.id ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="font-semibold text-sm">{cat.label.replace('\n', ' ')}</span>
                {activeCategory === cat.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
          </div>

          {/* Drawer Footer (Actions) - FIXED BOTTOM */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col space-y-2 pb-8 flex-shrink-0">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white text-slate-600 transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
              <Settings size={20} />
              <span className="font-medium text-sm">Ayarlar</span>
            </button>
            
            {/* LOGOUT BUTTON IN DRAWER */}
            {user && (
               <button 
                  onClick={() => { setIsMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors border border-transparent hover:border-red-100 hover:shadow-sm mt-2"
               >
                  <LogOut size={20} />
                  <span className="font-medium text-sm">Çıkış Yap</span>
               </button>
            )}
          </div>
        </div>
      </>

      {/* STICKY HEADER */}
      <div 
        className="sticky top-0 z-10 w-full overflow-hidden shadow-2xl shadow-slate-900/20 transition-all duration-100 ease-linear bg-slate-900"
        style={{ height: `${currentHeight}px` }}
      >
        {/* Background Image Slideshow */}
        {HERO_IMAGES.map((imgSrc, index) => (
          <img 
            key={index}
            src={imgSrc} 
            alt="Hero Background"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`} 
          />
        ))}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70"></div>
        
        {/* ACTION BUTTONS */}
        <button 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsSearchOpen(true)}
          className="absolute top-12 left-6 bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-white/30 transition-colors z-40 ring-1 ring-white/20 shadow-lg active:scale-95"
        >
          <Search size={20} />
        </button>

        {/* MENU BUTTON (ALWAYS MENU ICON) */}
        <button 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-12 right-6 z-40 bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-white/30 ring-1 ring-white/20 shadow-lg transition-transform active:scale-95"
        >
          <Menu size={20} />
        </button>

        {/* SEARCH OVERLAY */}
        {isSearchOpen && (
           <div className="absolute top-0 left-0 right-0 h-32 bg-slate-900/95 backdrop-blur-xl z-50 flex items-end pb-6 px-6 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="w-full relative">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Mekan veya kategori ara..." 
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsSearchOpen(false); }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-white/10 rounded-full text-white/70 hover:bg-white/30"
                >
                  <X size={16} />
                </button>
              </div>
           </div>
        )}

        {/* EXPANDED CONTENT */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-4 pointer-events-none"
          style={{ 
            opacity: isSearchOpen ? 0 : bigContentOpacity, 
            transition: 'opacity 0.2s'
          }}
        >
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)] mb-2" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
              EDİRNE
            </h1>
            <div className="flex items-center space-x-3 mb-2">
               <div className="h-[2px] w-8 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]"></div>
               <p className="text-white text-lg font-bold tracking-[0.2em] drop-shadow-lg uppercase" style={{ textShadow: '0 2px 5px rgba(0,0,0,1)' }}>
                Şehir Rehberi
               </p>
               <div className="h-[2px] w-8 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]"></div>
            </div>
          </div>
        </div>

        {/* COLLAPSED CONTENT */}
        <div 
          className="absolute bottom-10 left-0 right-0 text-center transition-opacity duration-300 z-20 flex flex-col items-center pointer-events-none"
          style={{ opacity: isSearchOpen ? 0 : smallContentOpacity }}
        >
          <h1 className="text-xl font-black text-white tracking-wider drop-shadow-md">EDİRNE</h1>
        </div>
      </div>

      {/* MAIN CONTENT BODY */}
      <div className="bg-slate-100 relative z-20 flex-1 rounded-t-3xl -mt-6 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        
        {/* Horizontal Category Slider */}
        <HorizontalScrollSlider activeCategory={activeCategory} onCategorySelect={handleCategoryClick} categories={categories} />

        {/* List Section */}
        <div className="px-5 pb-4 mt-2 min-h-[500px]">
          <div className="flex items-center space-x-3 mb-6 mt-4 pl-1">
            <div className="w-1.5 h-8 bg-orange-600 rounded-full shadow-sm"></div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                {activeCategory ? activeCategory : 'Popüler Mekanlar'}
              </h2>
              <p className="text-xs text-slate-400 font-bold mt-1">
                {shouldShowSubCategories
                  ? `${filteredSubCategories.length} Kategori` 
                  : `${sortedPlaces.length} Mekan Listelendi`
                }
              </p>
            </div>
          </div>

          <div className="space-y-4 pb-20">
            {shouldShowSubCategories ? (
              // --- SUB CATEGORIES LIST ---
              filteredSubCategories.length > 0 ? (
                filteredSubCategories.map((sub, index) => (
                  <div 
                    key={sub.id}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => onSubCategorySelect(sub.id)}
                    className="group bg-white rounded-2xl p-3 shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-slate-200 flex items-stretch active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden relative h-[140px]"
                  >
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="w-32 flex-shrink-0 relative overflow-hidden rounded-xl shadow-md">
                      <img 
                        src={sub.image} 
                        alt={sub.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 ml-4 flex flex-col justify-center py-1 relative z-10">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                        {sub.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 font-medium">
                        {sub.description}
                      </p>
                      
                      <div className="mt-auto flex items-center text-orange-600 text-[10px] font-bold uppercase tracking-wider">
                        <span>Keşfet</span>
                        <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <LayoutGrid size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Bu kategori için alt başlıklar hazırlanıyor.</p>
                </div>
              )
            ) : (
              // --- PLACES LIST ---
              sortedPlaces.length > 0 ? (
                sortedPlaces.map((place) => (
                  <div 
                    key={place.id}
                    onMouseDown={(e) => e.stopPropagation()} 
                    onClick={() => onPlaceSelect(place.id)}
                    className="bg-white p-3 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-slate-200 flex space-x-4 active:scale-[0.98] transition-transform duration-200 cursor-pointer"
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
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide bg-orange-50 px-1.5 py-0.5 rounded mb-1 border border-orange-100">
                          {place.category}
                        </span>
                        <div className="flex items-center space-x-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                          <Star size={10} className="text-orange-500 fill-orange-500" />
                          <span className="text-[10px] font-bold text-slate-700">{place.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight mt-1">
                        {place.title}
                      </h3>
                      <div className="flex items-center text-slate-400 mt-auto">
                        <MapPin size={12} className="mr-1 text-slate-400" />
                        <span className="text-[11px] truncate w-32 font-medium">{place.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-gray-300 pl-2 border-l border-dashed border-gray-100">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <LayoutGrid size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Bu kategoride içerik bulunamadı.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
