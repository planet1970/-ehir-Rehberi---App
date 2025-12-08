
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, Chrome } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToSignup: () => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToSignup, onBack }) => {
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
};
