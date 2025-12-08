
import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Place, Screen, CategoryData, SubCategoryData, User } from './types';
import { api } from './services/api'; 
import { Signal, Wifi, Battery, Home, Compass, Heart, User as UserIcon } from 'lucide-react';

// Components
import { NavIcon } from './components/NavIcon';

// Screens
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SubCategoryDetailScreen } from './screens/SubCategoryDetailScreen';
import { DetailScreen } from './screens/DetailScreen';
import { ExtendedDetailScreen } from './screens/ExtendedDetailScreen';

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
    setCurrentScreen('home'); 
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans select-none">
      {/* Phone Frame */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-slate-800 ring-1 ring-slate-700 flex flex-col">
        
        {/* Status Bar */}
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

        {/* Bottom Navigation Bar */}
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
