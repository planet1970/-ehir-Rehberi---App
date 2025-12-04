
export interface Place {
  id: string;
  title: string;
  category: string;
  subCategoryId?: string;
  image: string;
  rating: number;
  location: string;
  description: string;
  // Yeni Detay Alanları
  architect?: string;
  year?: string;
  tags?: string[];
  history?: string;
  architecture?: string;
  legends?: string;
  visitingHours?: string;
  entranceFee?: string;
}

export type Category = 'Tümü' | 'Camiler' | 'Müzeler' | 'Köprüler' | 'Çarşılar';

export type Screen = 'home' | 'detail' | 'subCategory' | 'subCategoryDetail' | 'extendedDetail';

export interface FileStructureItem {
  name: string;
  type: 'folder' | 'file';
  children?: FileStructureItem[];
}
