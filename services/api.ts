
import { Place, CategoryData, SubCategoryData } from '../types';
import { PLACES, CATEGORY_DATA, SUB_CATEGORIES } from '../constants';

// Bu dosya, gerçek bir Backend API'yi simüle eder.
// İleride buradaki 'resolve' kısımlarını gerçek 'fetch' veya 'axios' çağrılarıyla değiştirebilirsiniz.

// Ağ gecikmesini simüle etmek için bekleme süresi (ms)
const SIMULATED_DELAY = 1200; 

export const api = {
  // Kategorileri Getir
  getCategories: async (): Promise<CategoryData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CATEGORY_DATA);
      }, 800);
    });
  },

  // Alt Kategorileri Getir
  getSubCategories: async (): Promise<SubCategoryData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SUB_CATEGORIES);
      }, 800);
    });
  },

  // Tüm Mekanları Getir
  getPlaces: async (): Promise<Place[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PLACES);
      }, SIMULATED_DELAY);
    });
  },

  // Kategoriye Göre Mekanları Getir (Backend'de filtreleme simülasyonu)
  getPlacesByCategory: async (categoryId: string): Promise<Place[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = PLACES.filter(p => p.category === categoryId);
        resolve(filtered);
      }, 600);
    });
  },

  // ID'ye Göre Mekan Detayı Getir
  getPlaceDetail: async (placeId: string): Promise<Place | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const place = PLACES.find(p => p.id === placeId);
        resolve(place);
      }, 400);
    });
  }
};
