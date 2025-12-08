
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';
import { ArrowLeft, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

interface SignUpScreenProps {
  onSignupSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignupSuccess, onNavigateToLogin, onBack }) => {
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
};
