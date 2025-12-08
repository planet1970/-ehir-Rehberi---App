
import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Place, Screen, CategoryData, SubCategoryData, User } from './types';
import { api } from './services/api'; // Import the new API service
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
  User as UserIcon,
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
  Edit3,
  Loader2,
  Utensils,
  Flame,
  Coffee,
  ChefHat,
  Armchair,
  Volume2,
  StopCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Chrome
} from 'lucide-react';

// --- MOCK AUTH SERVICE ---
const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({
            id: 'u1',
            name: 'Mert Yılmaz',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            stats: {
              reviews: 12,
              favorites: 5,
              visited: 8
            }
          });
        } else {
          reject(new Error('Giriş başarısız'));
        }
      }, 1500);
    });
  },
  signup: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'u2',
          name: name,
          email: email,
          avatar: undefined, // No avatar initially
          stats: { reviews: 0, favorites: 0, visited: 0 }
        });
      }, 1500);
    });
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  
  // Application Data State (Fetched from API)
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryData[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // User State
  const [user, setUser] = useState<User | null>(null);
  
  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Track scroll position for animations
  const [scrollY, setScrollY] = useState(0);

  // Drag to scroll logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // --- INITIAL DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Parallel fetching for better performance
        const [catsData, subCatsData, placesData] = await Promise.all([
          api.getCategories(),
          api.getSubCategories(),
          api.getPlaces()
        ]);
        
        setCategories(catsData);
        setSubCategories(subCatsData);
        setPlaces(placesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        // Minimum loading time for aesthetics
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    fetchData();
  }, []);

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

  const handleProfileClick = () => {
    if (user) {
      setCurrentScreen('profile');
    } else {
      setCurrentScreen('login');
    }
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
    } else if (['login', 'signup', 'profile'].includes(currentScreen)) {
      setCurrentScreen('home');
    }
  };

  const handleOnboardingFinish = () => {
    setShowOnboarding(false);
  };

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentScreen('home'); // Or profile
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans select-none">
      {/* Phone Frame */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-slate-800 ring-1 ring-slate-700 flex flex-col">
        
        {/* Status Bar (Simulated) */}
        <div className="absolute top-0 left-0 right-0 h-11 z-50 flex justify-between items-center px-6 pt-2 text-white text-xs font-semibold drop-shadow-md pointer-events-none">
          <span>09:41</span>
          <div className="flex space-x-1.5 items-center">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={18} />
          </div>
        </div>

        {/* LOADING SCREEN */}
        {isLoading ? (
          <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center relative z-40">
            <div className="absolute inset-0 bg-[url('https://www.turkiyesehirrehberi.org/wp-content/uploads/2020/12/meric-nehri-edirne.jpg')] bg-cover opacity-20 blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-orange-600/30 border-t-orange-500 animate-spin mb-6"></div>
              <h2 className="text-white text-2xl font-black tracking-tight mb-2">EDİRNE</h2>
              <p className="text-orange-400 text-sm font-bold tracking-widest uppercase">Şehir Rehberi</p>
            </div>
            <div className="absolute bottom-10 text-slate-500 text-xs">Veriler Yükleniyor...</div>
          </div>
        ) : showOnboarding ? (
          /* ONBOARDING SCREEN */
          <OnboardingScreen onFinish={handleOnboardingFinish} />
        ) : (
          /* MAIN CONTENT */
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
                categories={categories}
                subCategories={subCategories}
                places={places}
                user={user}
                onProfileClick={handleProfileClick}
                onLogout={handleLogout}
              />
            ) : currentScreen === 'subCategoryDetail' ? (
              <SubCategoryDetailScreen 
                subCategoryId={selectedSubCategoryId}
                onBack={goBack}
                onPlaceSelect={navigateToDetail}
                subCategories={subCategories}
                places={places}
              />
            ) : currentScreen === 'detail' ? (
              <DetailScreen 
                placeId={selectedPlaceId} 
                onBack={goBack}
                onMoreInfo={navigateToExtendedDetail}
                places={places}
              />
            ) : currentScreen === 'extendedDetail' ? (
              <ExtendedDetailScreen 
                placeId={selectedPlaceId} 
                onBack={goBack}
                places={places}
              />
            ) : currentScreen === 'login' ? (
              <LoginScreen 
                onLoginSuccess={handleLoginSuccess}
                onNavigateToSignup={() => setCurrentScreen('signup')}
                onBack={() => setCurrentScreen('home')}
              />
            ) : currentScreen === 'signup' ? (
              <SignUpScreen 
                onSignupSuccess={handleLoginSuccess}
                onNavigateToLogin={() => setCurrentScreen('login')}
                onBack={() => setCurrentScreen('home')}
              />
            ) : (
              <ProfileScreen 
                user={user}
                onLogout={handleLogout}
                onBack={() => setCurrentScreen('home')}
              />
            )}
          </div>
        )}

        {/* Bottom Navigation Bar - Visible on ALL screens (except loading/onboarding) */}
        {!isLoading && !showOnboarding && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 pb-8 flex justify-between items-center z-40 pointer-events-auto shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <div onClick={() => setCurrentScreen('home')} className="cursor-pointer">
              <NavIcon icon={<Home size={24} />} label="Ana Sayfa" active={currentScreen === 'home'} />
            </div>
            <NavIcon icon={<Compass size={24} />} label="Keşfet" active={currentScreen === 'subCategoryDetail'} />
            <NavIcon icon={<Heart size={24} />} label="Favoriler" />
            <div onClick={handleProfileClick} className="cursor-pointer">
              <NavIcon icon={<UserIcon size={24} />} label="Profil" active={currentScreen === 'profile' || currentScreen === 'login' || currentScreen === 'signup'} />
            </div>
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

// --- ONBOARDING SCREEN ---
function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
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
}

// --- SCREENS ---

function HomeScreen({ 
  onPlaceSelect, 
  onSubCategorySelect,
  scrollY,
  categories,
  subCategories,
  places,
  user,
  onProfileClick,
  onLogout
}: { 
  onPlaceSelect: (id: string) => void, 
  onSubCategorySelect: (id: string) => void,
  scrollY: number,
  categories: CategoryData[],
  subCategories: SubCategoryData[],
  places: Place[],
  user: User | null,
  onProfileClick: () => void,
  onLogout: () => void
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
}

// Separate component for Horizontal Scroll to handle drag isolation
function HorizontalScrollSlider({ 
  activeCategory, 
  onCategorySelect,
  categories
}: { 
  activeCategory: string | null, 
  onCategorySelect: (e: React.MouseEvent, id: string) => void,
  categories: CategoryData[]
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
}

// --- AUTH SCREENS ---

function LoginScreen({ onLoginSuccess, onNavigateToSignup, onBack }: { 
  onLoginSuccess: (user: User) => void, 
  onNavigateToSignup: () => void,
  onBack: () => void 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      alert("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google Login
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
            id: 'u3',
            name: 'Google Kullanıcısı',
            email: 'google@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
            stats: { reviews: 0, favorites: 0, visited: 0 }
        });
    }, 1000);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="relative h-64 bg-orange-600 flex flex-col justify-end p-8 overflow-hidden rounded-b-[40px] shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full transform -translate-x-10 translate-y-10"></div>
        
        <button onClick={onBack} className="absolute top-12 left-6 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 backdrop-blur-sm">
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-3xl font-black text-white mb-2 relative z-10">Tekrar<br/>Hoşgeldiniz</h1>
        <p className="text-orange-100 text-sm relative z-10">Hesabınıza giriş yaparak Edirne'yi keşfetmeye devam edin.</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-8 pt-10 overflow-y-auto">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">E-Posta Adresi</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-medium text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="ornek@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Şifre</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 font-medium text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-orange-600 hover:text-orange-700">Şifremi Unuttum?</button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-600/30 active:scale-[0.98] transition-transform flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <span>Giriş Yap</span>}
          </button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">veya</span>
            </div>
        </div>

        <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 mb-4"
        >
            <Chrome size={20} className="text-blue-600" />
            <span>Google ile Giriş Yap</span>
        </button>

        <div className="mt-4 text-center pb-8">
          <p className="text-slate-500 text-sm font-medium">
            Hesabınız yok mu? <button onClick={onNavigateToSignup} className="text-orange-600 font-bold hover:underline">Kayıt Ol</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignUpScreen({ onSignupSuccess, onNavigateToLogin, onBack }: { 
  onSignupSuccess: (user: User) => void, 
  onNavigateToLogin: () => void,
  onBack: () => void 
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await authService.signup(name, email, password);
      onSignupSuccess(user);
    } catch (err) {
      alert("Kayıt oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
       <div className="px-6 pt-12 pb-6">
         <button onClick={onBack} className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-slate-200">
            <ArrowLeft size={20} />
         </button>
         <h1 className="text-3xl font-black text-slate-900 mt-6 mb-2">Hesap Oluştur</h1>
         <p className="text-slate-500">Edirne Rehberi'ne katılarak deneyimini özelleştir.</p>
       </div>

       <div className="flex-1 px-6">
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Ad Soyad</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon size={20} />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-medium text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">E-Posta</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-medium text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="ornek@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Şifre</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-medium text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-transform flex items-center justify-center space-x-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <span>Kayıt Ol</span>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Zaten hesabınız var mı? <button onClick={onNavigateToLogin} className="text-orange-600 font-bold hover:underline">Giriş Yap</button>
          </p>
        </div>
       </div>
    </div>
  );
}

function ProfileScreen({ user, onLogout, onBack }: { user: User | null, onLogout: () => void, onBack: () => void }) {
  if (!user) return null;

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-20">
      {/* Profile Header */}
      <div className="bg-white pb-6 rounded-b-[40px] shadow-sm relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-orange-400 to-pink-500"></div>
        
        <div className="px-6 pt-12 relative z-10 flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-slate-400" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-white text-white">
               <CheckCircle size={12} fill="currentColor" className="text-white" />
            </div>
          </div>
          
          <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
          <p className="text-sm text-slate-500 font-medium">{user.email}</p>

          {/* Stats Row */}
          <div className="flex items-center space-x-8 mt-6 w-full justify-center">
             <div className="flex flex-col items-center">
                <span className="text-lg font-black text-slate-800">{user.stats.visited}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ziyaret</span>
             </div>
             <div className="h-8 w-px bg-slate-200"></div>
             <div className="flex flex-col items-center">
                <span className="text-lg font-black text-slate-800">{user.stats.favorites}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Favori</span>
             </div>
             <div className="h-8 w-px bg-slate-200"></div>
             <div className="flex flex-col items-center">
                <span className="text-lg font-black text-slate-800">{user.stats.reviews}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Yorum</span>
             </div>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="flex-1 px-6 pt-6 space-y-3 overflow-y-auto">
         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 mb-1">Hesap</p>
         
         <button className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
            <div className="flex items-center space-x-3">
               <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
                  <UserIcon size={20} />
               </div>
               <span className="font-bold text-slate-700 text-sm">Profili Düzenle</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
         </button>

         <button className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
            <div className="flex items-center space-x-3">
               <div className="bg-pink-50 p-2 rounded-xl text-pink-600">
                  <Heart size={20} />
               </div>
               <span className="font-bold text-slate-700 text-sm">Favorilerim</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
         </button>

         <button className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
            <div className="flex items-center space-x-3">
               <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                  <Bell size={20} />
               </div>
               <span className="font-bold text-slate-700 text-sm">Bildirimler</span>
            </div>
            <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</div>
         </button>

         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 mb-1 mt-4">Diğer</p>

         <button className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
            <div className="flex items-center space-x-3">
               <div className="bg-slate-50 p-2 rounded-xl text-slate-600">
                  <Settings size={20} />
               </div>
               <span className="font-bold text-slate-700 text-sm">Uygulama Ayarları</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
         </button>

         <button className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
            <div className="flex items-center space-x-3">
               <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                  <HelpCircle size={20} />
               </div>
               <span className="font-bold text-slate-700 text-sm">Yardım & Destek</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
         </button>

         <button className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
            <div className="flex items-center space-x-3">
               <div className="bg-slate-50 p-2 rounded-xl text-slate-600">
                  <Shield size={20} />
               </div>
               <span className="font-bold text-slate-700 text-sm">Gizlilik ve Güvenlik</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
         </button>

         <button 
            onClick={onLogout}
            className="w-full bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-center space-x-2 mt-4 active:scale-[0.98] transition-transform"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="font-bold text-red-600 text-sm">Çıkış Yap</span>
         </button>
         
         <div className="text-center py-4">
            <p className="text-[10px] text-slate-400 font-bold">Versiyon 1.0.2</p>
         </div>
      </div>
    </div>
  );
}

function SubCategoryDetailScreen({ 
  subCategoryId, 
  onBack, 
  onPlaceSelect,
  subCategories,
  places
}: { 
  subCategoryId: string | null, 
  onBack: () => void,
  onPlaceSelect: (id: string) => void,
  subCategories: SubCategoryData[],
  places: Place[]
}) {
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
}

// Helper for standardized info card
function InfoCard({ label, value, icon: Icon }: { label: string, value: string | undefined, icon: React.ElementType }) {
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
}

function DetailScreen({ 
  placeId, 
  onBack, 
  onMoreInfo,
  places
}: { 
  placeId: string | null, 
  onBack: () => void, 
  onMoreInfo: () => void,
  places: Place[]
}) {
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
}

function ExtendedDetailScreen({ 
  placeId, 
  onBack,
  places
}: { 
  placeId: string | null, 
  onBack: () => void,
  places: Place[]
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const place = places.find(p => p.id === placeId);
  
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

  // Ensure voices are loaded (some browsers load async)
  useEffect(() => {
     if ('speechSynthesis' in window) {
         window.speechSynthesis.getVoices();
     }
     return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

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
}
