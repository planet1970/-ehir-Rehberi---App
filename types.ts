
import { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  stats: {
    reviews: number;
    favorites: number;
    visited: number;
  }
}

export interface Place {
  id: string;
  title: string;
  category: string;
  subCategoryId?: string;
  image: string;
  rating: number;
  location: string;
  description: string;
  // Detay Alanları (Tarihi Yerler İçin)
  architect?: string;
  year?: string;
  // Detay Alanları (Yeme & İçme İçin)
  cuisine?: string; // Örn: Ciğerci, Tatlıcı
  specialty?: string; // Örn: Tava Ciğer, Badem Ezmesi
  atmosphere?: string; // Örn: Esnaf Lokantası, Tarihi Konak, Aile Yeri
  // Ortak Detaylar
  tags?: string[];
  history?: string; // Restoranlar için "Hikayemiz" olarak kullanılacak
  architecture?: string; // Restoranlar için "Lezzet Sırları" olarak kullanılacak
  legends?: string; // Restoranlar için "Menü Önerisi" olarak kullanılacak
  visitingHours?: string;
  entranceFee?: string;
}

export interface CategoryData {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SubCategoryData {
  id: string;
  parentCategoryId: string; // Hangi ana kategoriye ait olduğu (Gezilecek Yerler veya Yeme & İçme)
  title: string;
  description: string;
  image: string;
}

export type Category = 'Tümü' | 'Camiler' | 'Müzeler' | 'Köprüler' | 'Çarşılar';

export type Screen = 'home' | 'detail' | 'subCategory' | 'subCategoryDetail' | 'extendedDetail' | 'login' | 'signup' | 'profile';

export interface FileStructureItem {
  name: string;
  type: 'folder' | 'file';
  children?: FileStructureItem[];
}
