import type { Place, PlaceCategory, DiscoveryQuery, IPlaceDiscoveryService, Province, DistrictMeta } from '../types/travel.ts';
import phetchabunData from '../data/phetchabun.json' with { type: 'json' };
import provincesData from '../data/provinces.json' with { type: 'json' };

const defaultPlacesDataset: Record<string, Place[]> = {
  phetchabun: phetchabunData as Place[],
  phetchaburi: [], // Ready for future province expansion
};

const defaultProvinces: Province[] = provincesData as Province[];

/**
 * Pure, side-effect-free function to filter and rank places based on query criteria.
 * Supports Multi-District filtering, Rating thresholds, Keyword search, and Sorting.
 */
export function filterPlaces(places: Place[], query?: DiscoveryQuery): Place[] {
  if (!query) return places;

  let result = [...places];

  // 1. Filter by district(s) - Supports both multi-select array and single district string
  if (query.districts && query.districts.length > 0) {
    const validDistricts = query.districts.filter((d) => d !== 'ทั้งหมด');
    if (validDistricts.length > 0) {
      result = result.filter((p) => validDistricts.includes(p.district));
    }
  } else if (query.district && query.district !== 'ทั้งหมด') {
    result = result.filter((p) => p.district === query.district);
  }

  // 2. Filter by category
  if (query.category && query.category !== 'all') {
    result = result.filter((p) => p.category === query.category);
  }

  // 3. Filter by minimum rating
  if (query.minRating && query.minRating > 0) {
    result = result.filter((p) => p.rating >= (query.minRating as number));
  }

  // 4. Search by keyword across name, description, district, category, and highlights
  if (query.searchKeyword && query.searchKeyword.trim() !== '') {
    const keyword = query.searchKeyword.trim().toLowerCase();
    result = result.filter((p) => {
      const matchName = p.name.toLowerCase().includes(keyword);
      const matchDesc = p.description.toLowerCase().includes(keyword);
      const matchDistrict = p.district.toLowerCase().includes(keyword);
      const matchCategory = p.categoryLabel.toLowerCase().includes(keyword);
      const matchHighlight = p.highlights.some((h) => h.toLowerCase().includes(keyword));
      return matchName || matchDesc || matchDistrict || matchCategory || matchHighlight;
    });
  }

  // 5. Sort results
  if (query.sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (query.sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'th'));
  } else {
    // Default: 'recommended' -> featured first, then sorted by rating
    result.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.rating - a.rating;
    });
  }

  return result;
}

/**
 * Deep Module: PlaceDiscoveryService
 */
export class PlaceDiscoveryService implements IPlaceDiscoveryService {
  private activeProvinceId: string;
  private readonly datasets: Record<string, Place[]>;
  private readonly provinces: Province[];

  constructor(
    defaultProvinceId: string = 'phetchabun',
    datasets: Record<string, Place[]> = defaultPlacesDataset,
    provinces: Province[] = defaultProvinces
  ) {
    this.activeProvinceId = defaultProvinceId;
    this.datasets = datasets;
    this.provinces = provinces;
  }

  setProvince(provinceId: string) {
    this.activeProvinceId = provinceId;
  }

  getProvinces(): Province[] {
    return this.provinces;
  }

  getActiveProvince(): Province {
    const prov = this.provinces.find((p) => p.id === this.activeProvinceId);
    return prov || this.provinces[0];
  }

  getPlaces(query?: DiscoveryQuery): Place[] {
    const targetProvince = query?.provinceId || this.activeProvinceId;
    const places = this.datasets[targetProvince] || [];
    return filterPlaces(places, query);
  }

  getPlaceById(id: string): Place | undefined {
    for (const placeList of Object.values(this.datasets)) {
      const found = placeList.find((p) => p.id === id);
      if (found) return found;
    }
    return undefined;
  }

  getDistricts(provinceId: string = this.activeProvinceId): string[] {
    const prov = this.provinces.find((p) => p.id === provinceId);
    return prov ? prov.districts : ['ทั้งหมด'];
  }

  /**
   * Calculates real counts of places per district in the selected province
   */
  getDistrictCounts(provinceId: string = this.activeProvinceId): DistrictMeta[] {
    const places = this.datasets[provinceId] || [];
    const prov = this.provinces.find((p) => p.id === provinceId);
    const districtsList = prov ? prov.districts : ['ทั้งหมด'];

    const counts: Record<string, number> = {};
    for (const place of places) {
      counts[place.district] = (counts[place.district] || 0) + 1;
    }

    return districtsList.map((district) => ({
      name: district,
      count: district === 'ทั้งหมด' ? places.length : (counts[district] || 0),
    }));
  }

  getCategories(): { id: PlaceCategory | 'all'; label: string; iconName: string }[] {
    return [
      { id: 'all', label: 'ทั้งหมด', iconName: 'Compass' },
      { id: 'mountain_view', label: 'ยอดดอย & ทะเลหมอก', iconName: 'Mountain' },
      { id: 'nature_park', label: 'อุทยาน น้ำตก & ถ้ำ', iconName: 'Trees' },
      { id: 'heritage_history', label: 'มรดกโลก & ประวัติศาสตร์', iconName: 'Landmark' },
      { id: 'temple_culture', label: 'วัด & ศาสนสถาน', iconName: 'Sparkles' },
      { id: 'lifestyle_farm', label: 'การเกษตร & วิถีชุมชน', iconName: 'Coffee' },
    ];
  }
}

// Default singleton instance for application use
export const discoveryService = new PlaceDiscoveryService('phetchabun');
