export type PlaceCategory =
  | 'mountain_view'     // ยอดดอย & ทะเลหมอก
  | 'nature_park'       // อุทยาน น้ำตก & ถ้ำ
  | 'heritage_history'  // มรดกโลก & ประวัติศาสตร์
  | 'temple_culture'    // วัด & ศาสนสถาน
  | 'lifestyle_farm';   // การเกษตร วิถีชุมชน & พักผ่อน

export interface PlaceCoordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  district: string;       // อำเภอ
  provinceId: string;     // เช่น 'phetchabun'
  category: PlaceCategory;
  categoryLabel: string;  // เช่น 'ยอดดอย & ทะเลหมอก'
  description: string;
  coordinates: PlaceCoordinates;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  isFeatured?: boolean;
  history?: string;            // ประวัติความเป็นมา ความเป็นมาทางประวัติศาสตร์หรือตำนาน
  pros?: string[];             // ข้อดี / จุดเด่น ทำไมต้องมาที่นี่
  galleryImages?: string[];    // รูปภาพตัวอย่างเพิ่มเติม
  bestTimeToVisit?: string;    // ช่วงเวลาที่แนะนำให้ไป
  tips?: string[];             // คำแนะนำ / ข้อควรระวัง
  amenities?: string[];        // สิ่งอำนวยความสะดวก
}

export interface Province {
  id: string;
  nameTh: string;
  nameEn: string;
  center: PlaceCoordinates;
  zoom: number;
  districts: string[];
  description: string;
  coverImage: string;
}

export interface DistrictMeta {
  name: string;
  count: number;
}

export interface DiscoveryQuery {
  provinceId?: string;
  district?: string;
  districts?: string[];     // Multi-district selection
  category?: PlaceCategory | 'all';
  searchKeyword?: string;
  sortBy?: 'recommended' | 'rating' | 'name';
  minRating?: number;       // Filter by minimum rating (e.g. 4.0, 4.5)
}

export interface IPlaceDiscoveryService {
  getPlaces(query?: DiscoveryQuery): Place[];
  getPlaceById(id: string): Place | undefined;
  getDistricts(provinceId: string): string[];
  getDistrictCounts(provinceId: string): DistrictMeta[];
  getCategories(): { id: PlaceCategory | 'all'; label: string; iconName: string }[];
}
