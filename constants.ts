
import { Place, Category } from './types';
import { 
  Landmark, 
  Utensils, 
  Ticket, 
  Bed, 
  Map, 
  ShoppingBag, 
  Music, 
  Bus, 
  Stethoscope 
} from 'lucide-react';

export const APP_TITLE = "Edirne Rehberi";

// Kategoriler ve İkon Eşleşmeleri
export const CATEGORY_DATA = [
  { id: 'Gezilecek Yerler', label: 'Gezilecek\nYerler', icon: Landmark },
  { id: 'Yeme & İçme', label: 'Yeme &\nİçme', icon: Utensils },
  { id: 'Etkinlikler', label: 'Etkinlikler', icon: Ticket },
  { id: 'Konaklama', label: 'Konaklama', icon: Bed },
  { id: 'Rotalar', label: 'Rotalar', icon: Map },
  { id: 'Alışveriş', label: 'Alışveriş', icon: ShoppingBag },
  { id: 'Eğlence', label: 'Eğlence', icon: Music },
  { id: 'Ulaşım', label: 'Ulaşım', icon: Bus },
  { id: 'Sağlık', label: 'Sağlık', icon: Stethoscope }
];

export const SUB_CATEGORIES = [
  { 
    id: 'favoriler', 
    title: 'Favoriler', 
    description: 'Edirne gezginlerinin en çok puan verdiği, mutlaka görülmesi gereken noktalar.',
    image: 'https://media.istockphoto.com/id/1219214780/tr/vekt%C3%B6r/turistik-yerler-semboller-ve-simgeleri-ile-t%C3%BCrkiye-el-%C3%A7izilmi%C5%9F-vekt%C3%B6r-ill%C3%BCstrasyon.jpg?s=1024x1024&w=is&k=20&c=9uTZ7da4ZbTiGdv7uHNACRr3iVw1zKJbCSCQIBysmTw=' 
  },
  { 
    id: 'tarihi', 
    title: 'Tarihi Mekanlar', 
    description: 'Osmanlı\'ya 92 yıl başkentlik yapmış şehrin sokaklarında tarihe yolculuk yapın.',
    image: 'https://www.trakyacityhotel.com/wp-content/uploads/2014/01/selimiye-camii.jpg' 
  },
  { 
    id: 'carsi', 
    title: 'Çarşılar & Pazarlar', 
    description: 'Ali Paşa\'dan Arasta\'ya, tarihi atmosferde alışverişin keyfini çıkarın.',
    image: 'https://acrpalas.com/wp-content/uploads/2017/03/carsi.jpg' 
  },
  { 
    id: 'muze', 
    title: 'Müzeler', 
    description: 'Sağlık Müzesi\'nden İslam Eserleri\'ne, şehrin kültür hazinelerini keşfedin.',
    image: 'https://edirne.ktb.gov.tr/Resim/431558,edirne-muzesi-4jpg.png?0' 
  },
  { 
    id: 'guzel', 
    title: 'Güzel Mekanlar', 
    description: 'Fotoğraf çekmek ve anı ölümsüzleştirmek için en estetik köşeler.',
    image: 'https://www.aksan-insaat.com/_FILES/Contents/651/Image.jpg?v=20251203144636' 
  },
  { 
    id: 'dogal', 
    title: 'Doğal Güzellikler', 
    description: 'Meriç ve Tunca nehirleri kıyısında, yeşilin ve mavinin buluştuğu alanlar.',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop' 
  }
];

export const CATEGORIES: string[] = CATEGORY_DATA.map(c => c.id);

export const PLACES: Place[] = [
  {
    id: '1',
    title: 'Selimiye Camii',
    category: 'Gezilecek Yerler',
    subCategoryId: 'tarihi',
    // Yeni Link
    image: 'https://www.trakyacityhotel.com/wp-content/uploads/2014/01/selimiye-camii.jpg',
    rating: 4.9,
    location: 'Meydan Mahallesi, Edirne',
    description: 'Mimar Sinan\'ın "Ustalık Eserim" dediği Selimiye, sadece bir ibadethane değil, aynı zamanda mühendislik ve estetiğin zirvesidir. Edirne\'nin her yerinden görülebilen ihtişamlı kubbesi ve kalem gibi ince minareleriyle şehrin silüetini taçlandırır. İçeri girdiğinizde sizi karşılayan ferahlık ve dinginlik, yüzyıllardır ziyaretçilerini büyülemeye devam etmektedir.',
    architect: 'Mimar Sinan',
    year: '1575',
    visitingHours: '08:30 - 22:30',
    entranceFee: 'Ücretsiz',
    history: 'II. Selim tarafından yaptırılan cami, Sinan\'ın 80 yaşında inşa ettiği başyapıtıdır. İnşaat alanı önceden Yıldırım Bayezid\'in yaptırdığı bir sarayın bulunduğu alandı.',
    architecture: 'Tek bir kubbe ile örtülü olan iç mekan, mekan bütünlüğü açısından dünya mimarlık tarihinin en önemli eserlerinden biridir. Minareleri, İstanbul\'daki camilere kıyasla çok daha ince ve uzundur. 31.25 metre çapındaki kubbesi, Ayasofya\'nın kubbesinden büyüktür.',
    legends: 'Ters Lale Motifi: Müezzin mahfilinin mermer ayağındaki ters lale motifi, caminin yapıldığı arsa sahibinin inatçılığını ve tersliğini simgelediği rivayet edilir. Bir başka rivayete göre ise lale, o dönemde bölgede yetişen laleleri temsil eder, ters olması ise arsa sahibinin vefatını simgeler.'
  },
  {
    id: '2',
    title: 'Meriç Köprüsü',
    category: 'Gezilecek Yerler',
    subCategoryId: 'dogal',
    image: 'https://www.turkiyesehirrehberi.org/wp-content/uploads/2020/12/meric-nehri-edirne.jpg',
    rating: 4.7,
    location: 'Karaağaç Yolu, Edirne',
    description: 'Abdülmecid tarafından yaptırılan, gün batımının en güzel izlendiği tarihi taş köprü.',
    architect: 'Bilinmiyor',
    year: '1847',
    visitingHours: '24 Saat Açık',
    entranceFee: 'Ücretsiz',
    history: 'Sultan Abdülmecid zamanında inşa edilen köprü, Edirne-Karaağaç yolunu birbirine bağlar. 263 metre uzunluğunda, 7 metre genişliğindedir.',
    architecture: 'Kesme taştan yapılmış olup 12 kemerlidir. Ortasında mermer bir kitabe köşkü bulunur. Bu köşk, padişahların gün batımını izlemesi için tasarlanmıştır.'
  },
  {
    id: '3',
    title: 'II. Bayezid Külliyesi',
    category: 'Müzeler',
    subCategoryId: 'muze',
    image: 'https://www.kulturportali.gov.tr/contents/images/20171106164201448_2_%20beyazit%20kulliye%20servet%20uygun%204.jpg',
    rating: 4.8,
    location: 'Yeniimaret, Edirne',
    description: 'Osmanlı döneminde akıl hastalarının müzik ve su sesiyle tedavi edildiği sağlık müzesi.',
    architect: 'Mimar Hayrettin',
    year: '1488',
    visitingHours: '09:00 - 17:30',
    entranceFee: '50 TL',
    history: 'II. Bayezid tarafından Tunca Nehri kıyısına yaptırılmıştır. Külliye; cami, tıp medresesi, şifahane, imaret, hamam ve mutfak gibi bölümlerden oluşur.',
    architecture: 'Şifahane bölümü, merkezi bir kubbe etrafında altıgen plan şemasına sahiptir. Akustik yapısı sayesinde müzik sesi binanın her yerine eşit dağılır.'
  },
  {
    id: '5',
    title: 'Eski Cami',
    category: 'Gezilecek Yerler',
    subCategoryId: 'tarihi',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/84/c5/1c/eski-cami.jpg?w=700&h=400&s=1',
    rating: 4.6,
    location: 'Merkez, Edirne',
    description: 'Edirne\'deki en eski anıtsal yapı. Dev hat yazılarıyla ünlüdür.',
    architect: 'Konyalı Hacı Alaaddin',
    year: '1414',
    visitingHours: 'İbadet Saatlerinde',
    entranceFee: 'Ücretsiz',
    history: 'Süleyman Çelebi tarafından 1403 yılında yapımına başlanmış, I. Mehmet (Çelebi) tarafından 1414 yılında tamamlanmıştır. Edirne\'nin ilk ulu camisidir.',
    architecture: 'Çok kubbeli ulu cami plan tipinin önemli örneklerindendir. İç mekanındaki devasa boyutlu hat yazıları (Allah, Muhammed ve dört halife isimleri) yapının en dikkat çekici özelliğidir.',
    legends: 'Kabe Taşı: Caminin mihrabının sağında Kabe\'den getirildiğine inanılan "Rükn-ü Yemani" taşı bulunmaktadır. Ayrıca Hacı Bayram Veli\'nin vaaz verdiği kürsü, saygıdan dolayı imamlar tarafından kullanılmaz.'
  },
  {
    id: '6',
    title: 'Karaağaç İstasyonu',
    category: 'Gezilecek Yerler',
    subCategoryId: 'guzel',
    image: 'https://image.hurimg.com/i/hurriyet/90/770x0/5f215b492269a22dacf9c570.jpg',
    rating: 4.5,
    location: 'Karaağaç, Edirne',
    description: 'Trakya Üniversitesi Rektörlük binası olarak kullanılan tarihi gar binası.',
    architect: 'Mimar Kemaleddin',
    year: '1914',
    visitingHours: '09:00 - 17:00',
    entranceFee: 'Ücretsiz',
    history: 'İstanbul\'daki Sirkeci Garı örnek alınarak yapılmıştır. I. Dünya Savaşı yıllarında tamamlanmış ancak savaş nedeniyle demiryolu güzergahı değişince istasyon olarak az kullanılmıştır.',
    architecture: 'Türk Neoklasik üslubunun en güzel örneklerinden biridir. Üç katlı, dikdörtgen planlı ve 80 metre uzunluğundadır.'
  },
  {
    id: '4',
    title: 'Ali Paşa Çarşısı',
    category: 'Alışveriş',
    subCategoryId: 'carsi',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
    rating: 4.5,
    location: 'Saraçlar Caddesi, Edirne',
    description: 'Mimar Sinan tarafından yapılan, Edirne\'nin en hareketli kapalı çarşısı.',
    architect: 'Mimar Sinan',
    year: '1560',
    visitingHours: '08:00 - 20:00',
    entranceFee: 'Ücretsiz',
    history: 'Sadrazam Hersekzade Semiz Ali Paşa tarafından Mimar Sinan\'a yaptırılmıştır. Geliri camilere vakfedilmiştir.',
    architecture: '300 metre uzunluğunda olup, 6 kapısı ve 130 dükkanı vardır. Kırmızı-beyaz taş işçiliği ile dikkat çeker.'
  }
];
