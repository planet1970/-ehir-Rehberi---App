
import React from 'react';
import { User } from '../types';
import { User as UserIcon, CheckCircle, ChevronRight, Heart, Bell, Settings, HelpCircle, Shield, LogOut } from 'lucide-react';

interface ProfileScreenProps {
  user: User | null;
  onLogout: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onBack }) => {
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
};
