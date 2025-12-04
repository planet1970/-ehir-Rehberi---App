
import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Place, Screen } from './types';
import { PLACES, CATEGORY_DATA, SUB_CATEGORIES } from './constants';
import { 
  MapPin, 
  ArrowLeft, 
  Star, 
  Clock, 
  Share2, 
  Battery, 
  Wifi, 
  Signal, 
  Menu,
  Home,
  Compass,
  Heart,
  User,
  ChevronRight,
  Search,
  Grid,
  Camera,
  ArrowRight,
  Info,
  Calendar,
  BookOpen,
  Feather,
  Ticket,
  LayoutGrid,
  X,
  Settings,
  LogOut,
  HelpCircle,
  Bell,
  Edit3
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  
  // Track scroll position for animations
  const [scrollY, setScrollY] = useState(0);

  // Drag to scroll logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const onMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollTop = scrollTop - walk;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  // Reset scroll when screen changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setScrollY(0);
    }
  }, [currentScreen]);

  // Navigation Logic
  const navigateToDetail = (id: string) => {
    setSelectedPlaceId(id);
    setCurrentScreen('detail');
  };

  const navigateToExtendedDetail = () => {
    setCurrentScreen('extendedDetail');
  };

  const navigateToSubCategoryDetail = (subCatId: string) => {
    setSelectedSubCategoryId(subCatId);
    setCurrentScreen('subCategoryDetail');
  };

  const goBack = () => {
    if (currentScreen === 'extendedDetail') {
      setCurrentScreen('detail');
    } else if (currentScreen === 'detail') {
      if (selectedSubCategoryId) {
        setCurrentScreen('subCategoryDetail');
      } else {
        setCurrentScreen('home');
      }
      setSelectedPlaceId(null);
    } else if (currentScreen === 'subCategoryDetail') {
      setCurrentScreen('home');
      setSelectedSubCategoryId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans select-none">
      {/* Phone Frame */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-slate-800 ring-1 ring-slate-700">
        
        {/* Status Bar (Simulated) */}
        <div className="absolute top-0 left-0 right-0 h-11 z-50 flex justify-between items-center px-6 pt-2 text-white text-xs font-semibold drop-shadow-md pointer-events-none">
          <span>09:41</span>
          <div className="flex space-x-1.5 items-center">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={18} />
          </div>
        </div>

        {/* Dynamic Screen Content with Drag Scroll */}
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onScroll={handleScroll}
          className={`h-full bg-slate-100 overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {currentScreen === 'home' ? (
            <HomeScreen 
              onPlaceSelect={navigateToDetail} 
              onSubCategorySelect={navigateToSubCategoryDetail} 
              scrollY={scrollY}
            />
          ) : currentScreen === 'subCategoryDetail' ? (
            <SubCategoryDetailScreen 
              subCategoryId={selectedSubCategoryId}
              onBack={goBack}
              onPlaceSelect={navigateToDetail}
            />
          ) : currentScreen === 'detail' ? (
            <DetailScreen 
              placeId={selectedPlaceId} 
              onBack={goBack}
              onMoreInfo={navigateToExtendedDetail}
            />
          ) : (
            <ExtendedDetailScreen 
              placeId={selectedPlaceId}
              onBack={goBack}
            />
          )}
        </div>

        {/* Bottom Navigation Bar */}
        {['home', 'subCategoryDetail'].includes(currentScreen) && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 pb-8 flex justify-between items-center z-40 pointer-events-auto shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <NavIcon icon={<Home size={24} />} label="Ana Sayfa" active={currentScreen === 'home'} />
            <NavIcon icon={<Compass size={24} />} label="Keşfet" active={currentScreen === 'subCategoryDetail'} />
            <NavIcon icon={<Heart size={24} />} label="Favoriler" />
            <NavIcon icon={<User size={24} />} label="Profil" />
          </div>
        )}

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-50 pointer-events-none"></div>
      </div>
      
      {/* Helper Text */}
      <div className="absolute bottom-8 text-slate-400 text-sm flex items-center gap-2">
        <span>📱 Mouse ile tutup sürükleyerek gezinebilirsiniz.</span>
      </div>
    </div>
  );
}

function NavIcon({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center space-y-1 ${active ? 'text-orange-600' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}

// --- SCREENS ---

function HomeScreen({ 
  onPlaceSelect, 
  onSubCategorySelect,
  scrollY
}: { 
  onPlaceSelect: (id: string) => void, 
  onSubCategorySelect: (id: string) => void,
  scrollY: number
}) {
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

  const isSightseeing = activeCategory === 'Gezilecek Yerler';

  const filteredPlaces = !activeCategory
    ? PLACES 
    : PLACES.filter(p => p.category === activeCategory); 

  // --- COLLAPSING HEADER LOGIC ---
  const HEADER_MAX_HEIGHT = 340;
  const HEADER_MIN_HEIGHT = 110;
  
  const currentHeight = Math.max(HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT - scrollY);
  const scrollRatio = Math.min(scrollY / (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT), 1);
  
  // Custom opacity calculations for sharper transitions
  const bigContentOpacity = Math.max(0, 1 - (scrollRatio * 2.5));
  const smallContentOpacity = scrollRatio > 0.85 ? 1 : 0;
  
  return (
    <div className="flex flex-col min-h-full relative bg-slate-100">
      
      {/* SIDE MENU (DRAWER) - IMPROVED */}
      <>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
        ></div>
        
        {/* Drawer Panel - Slide Effect */}
        <div 
          className={`absolute top-0 bottom-0 right-0 w-[80%] max-w-[300px] z-[61] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Drawer Header (Profile) */}
          <div className="relative h-48 bg-slate-900 overflow-hidden flex-shrink-0">
             {/* Abstract Decorations */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
             <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
             
             {/* Content */}
             <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white/20 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    E
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/10 rounded-full text-white/80 hover:bg-white/20 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div>
                   <h2 className="text-white font-bold text-xl leading-tight">Edirne Gezgini</h2>
                   <div className="flex items-center mt-1 text-slate-400 text-xs font-medium cursor-pointer hover:text-white transition-colors">
                      <span>Profili Düzenle</span>
                      <Edit3 size={12} className="ml-1" />
                   </div>
                </div>
             </div>
          </div>

          {/* Drawer Categories List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Hızlı Erişim</p>
            {CATEGORY_DATA.map((cat) => (
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

          {/* Drawer Footer (Actions) */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col space-y-2 pb-8">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white text-slate-600 transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
              <Settings size={20} />
              <span className="font-medium text-sm">Ayarlar</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white text-slate-600 transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
              <HelpCircle size={20} />
              <span className="font-medium text-sm">Yardım & Destek</span>
            </button>
            <div className="h-px bg-slate-200 my-1 mx-2"></div>
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors group">
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="font-bold text-sm">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </>

      {/* STICKY HEADER CONTAINER */}
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
        
        {/* ACTION BUTTONS (FIXED POSITIONS) */}
        
        {/* Left: Search Icon */}
        <button 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsSearchOpen(true)}
          className="absolute top-12 left-6 bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-white/30 transition-colors z-40 ring-1 ring-white/20 shadow-lg active:scale-95"
        >
          <Search size={20} />
        </button>

        {/* Right: Menu Icon */}
        <button 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-12 right-6 bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-white/30 transition-colors z-40 ring-1 ring-white/20 shadow-lg active:scale-95"
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

        {/* EXPANDED CONTENT (Big Title) */}
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

        {/* COLLAPSED CONTENT (Minimal Title) */}
        <div 
          className="absolute bottom-10 left-0 right-0 text-center transition-opacity duration-300 z-20 flex flex-col items-center pointer-events-none"
          style={{ opacity: isSearchOpen ? 0 : smallContentOpacity }}
        >
          <h1 className="text-xl font-black text-white tracking-wider drop-shadow-md">EDİRNE</h1>
        </div>
      </div>

      {/* MAIN CONTENT BODY (Overlapping Panel) */}
      <div className="bg-slate-100 relative z-20 flex-1 rounded-t-3xl -mt-6 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        
        {/* Horizontal Category Slider (Quick Access) */}
        <HorizontalScrollSlider activeCategory={activeCategory} onCategorySelect={handleCategoryClick} />

        {/* List Section */}
        <div className="px-5 pb-4 mt-2 min-h-[500px]">
          
          {/* Section Title */}
          <div className="flex items-center space-x-3 mb-6 mt-4 pl-1">
            <div className="w-1.5 h-8 bg-orange-600 rounded-full shadow-sm"></div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                {activeCategory ? activeCategory : 'Popüler Mekanlar'}
              </h2>
              <p className="text-xs text-slate-400 font-bold mt-1">
                {isSightseeing 
                  ? `${SUB_CATEGORIES.length} Kategori` 
                  : `${filteredPlaces.length} Mekan Listelendi`
                }
              </p>
            </div>
          </div>

          <div className="space-y-4 pb-20">
            {isSightseeing ? (
              // --- SUB CATEGORIES LIST (Magazin Style) ---
              SUB_CATEGORIES.map((sub, index) => (
                <div 
                  key={sub.id}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => onSubCategorySelect(sub.id)}
                  className="group bg-white rounded-2xl p-3 shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-slate-200 flex items-stretch active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden relative h-[140px]"
                >
                  {/* Decorative background circle */}
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                  {/* Left Image */}
                  <div className="w-32 flex-shrink-0 relative overflow-hidden rounded-xl shadow-md">
                    <img 
                      src={sub.image} 
                      alt={sub.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Right Content */}
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
              // --- PLACES LIST ---
              filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
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
}

// Separate component for Horizontal Slider to handle drag isolation
function HorizontalScrollSlider({ 
  activeCategory, 
  onCategorySelect 
}: { 
  activeCategory: string | null, 
  onCategorySelect: (e: React.MouseEvent, id: string) => void 
}) {
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
        {CATEGORY_DATA.map((cat, index) => (
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
}

function SubCategoryDetailScreen({ 
  subCategoryId, 
  onBack, 
  onPlaceSelect 
}: { 
  subCategoryId: string | null, 
  onBack: () => void,
  onPlaceSelect: (id: string) => void 
}) {
  const subCategory = SUB_CATEGORIES.find(s => s.id === subCategoryId);
  const places = PLACES.filter(p => p.subCategoryId === subCategoryId);

  if (!subCategory) return null;

  return (
    <div className="bg-slate-100 min-h-full flex flex-col">
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
          <span className="text-orange-200 text-xs font-bold bg-white/10 px-2 py-1 rounded mt-1 inline-block backdrop-blur-sm border border-white/10">{places.length} Mekan Listeleniyor</span>
        </div>
      </div>

      {/* Places List */}
      <div className="flex-1 px-5 pt-4 pb-6 space-y-4">
        {places.length > 0 ? (
          places.map((place) => (
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
}

function DetailScreen({ placeId, onBack, onMoreInfo }: { placeId: string | null, onBack: () => void, onMoreInfo: () => void }) {
  const place = PLACES.find(p => p.id === placeId);

  if (!place) return null;

  return (
    <div className="relative bg-white min-h-full">
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

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center space-x-3 border border-slate-100 shadow-sm">
             <div className="bg-white p-2 rounded-full shadow-md">
                <User size={18} className="text-orange-500" />
             </div>
             <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase">Mimar</p>
               <p className="text-sm font-bold text-slate-800 truncate max-w-[100px]">{place.architect || 'Bilinmiyor'}</p>
             </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center space-x-3 border border-slate-100 shadow-sm">
             <div className="bg-white p-2 rounded-full shadow-md">
                <Calendar size={18} className="text-orange-500" />
             </div>
             <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase">Yapım Yılı</p>
               <p className="text-sm font-bold text-slate-800">{place.year || 'Tarihi'}</p>
             </div>
          </div>
        </div>

        {/* Visiting Info Row */}
        {(place.visitingHours || place.entranceFee) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
             {place.visitingHours && (
               <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center py-4 shadow-sm">
                 <Clock size={20} className="text-emerald-600 mb-2" />
                 <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Saatler</span>
                 <span className="text-sm font-bold text-emerald-900">{place.visitingHours}</span>
               </div>
             )}
             {place.entranceFee && (
               <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center py-4 shadow-sm">
                 <Ticket size={20} className="text-blue-600 mb-2" />
                 <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Giriş</span>
                 <span className="text-sm font-bold text-blue-900">{place.entranceFee}</span>
               </div>
             )}
          </div>
        )}

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
                <p className="text-[10px] text-orange-600/70">Tarihçe, mimari ve efsaneler</p>
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
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
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
}

function ExtendedDetailScreen({ placeId, onBack }: { placeId: string | null, onBack: () => void }) {
  const place = PLACES.find(p => p.id === placeId);
  if (!place) return null;

  return (
    <div className="bg-white min-h-full pb-20">
      {/* Sticky Header with Background */}
      <div className="sticky top-0 bg-slate-900 text-white shadow-md z-50 px-6 py-4 flex items-center justify-between">
        <button 
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={onBack}
          className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors ring-1 ring-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold text-sm truncate max-w-[200px] tracking-wide">{place.title}</span>
        <div className="w-9"></div> 
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Title Area */}
        <div className="relative">
          <div className="absolute -left-6 top-0 bottom-0 w-2 bg-orange-500 rounded-r-full shadow-sm"></div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">{place.title}</h1>
          <div className="w-full h-px bg-gray-200 mt-4"></div>
        </div>

         {/* Visiting Info */}
         <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-2">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Ziyaret Bilgileri</h3>
            {place.visitingHours && (
              <div className="flex items-center text-sm text-slate-600">
                <Clock size={16} className="text-orange-500 mr-2" />
                <span>{place.visitingHours}</span>
              </div>
            )}
             {place.entranceFee && (
              <div className="flex items-center text-sm text-slate-600">
                <Ticket size={16} className="text-orange-500 mr-2" />
                <span>Giriş: {place.entranceFee}</span>
              </div>
            )}
         </div>

        {/* History Section */}
        {place.history && (
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-3 text-slate-800">
              <Clock size={20} className="text-orange-500" />
              <h2 className="text-xl font-bold">Tarihçe</h2>
            </div>
            <p className="text-slate-600 leading-7 text-base text-justify">
              {place.history}
            </p>
          </div>
        )}

        {/* Architecture Section */}
        {place.architecture && (
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center space-x-2 mb-3 text-slate-800">
              <Grid size={20} className="text-orange-500" />
              <h2 className="text-xl font-bold">Mimari Özellikler</h2>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
               <p className="text-slate-600 leading-7 text-base text-justify italic">
                "{place.architecture}"
               </p>
            </div>
          </div>
        )}

        {/* Legends Section */}
        {place.legends && (
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-2 mb-3 text-slate-800">
              <Feather size={20} className="text-purple-500" />
              <h2 className="text-xl font-bold text-purple-900">Efsaneler & Hikayeler</h2>
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
}
