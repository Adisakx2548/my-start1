'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Place, PlaceCategory, Province, DiscoveryQuery, DistrictMeta } from '../types/travel';
import { discoveryService } from '../services/discoveryService';

export interface TravelDiscoveryState {
  // Data
  places: Place[];
  activeProvince: Province;
  provinces: Province[];
  districtsMeta: DistrictMeta[];
  districts: string[];
  categories: { id: PlaceCategory | 'all'; label: string; iconName: string }[];
  
  // Selection & UI State
  selectedPlace: Place | null;
  detailPlace: Place | null;
  mobileViewMode: 'list' | 'map';
  isFilterModalOpen: boolean;

  // Active Query
  query: DiscoveryQuery;

  // Deep Actions
  actions: {
    setProvince: (provinceId: string) => void;
    setCategory: (category: PlaceCategory | 'all') => void;
    setDistrict: (district: string) => void;
    setDistricts: (districts: string[]) => void;
    toggleDistrict: (district: string) => void;
    setMinRating: (rating: number | undefined) => void;
    setSearchKeyword: (keyword: string) => void;
    setSortBy: (sortBy: 'recommended' | 'rating' | 'name') => void;
    selectPlace: (place: Place | null) => void;
    openDetail: (place: Place) => void;
    closeDetail: () => void;
    toggleMobileView: () => void;
    openFilterModal: () => void;
    closeFilterModal: () => void;
    resetFilters: () => void;
  };
}

/**
 * Deep Module Hook: Encapsulates all query state, business invariants,
 * multi-district filtering, ratings, autocomplete, and modal lifecycles.
 */
export function useTravelDiscovery(initialProvinceId: string = 'phetchabun'): TravelDiscoveryState {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(initialProvinceId);
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'name'>('recommended');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'map'>('list');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Metadata from service
  const provinces = useMemo(() => discoveryService.getProvinces(), []);
  const activeProvince = useMemo(() => {
    return provinces.find((p) => p.id === selectedProvinceId) || provinces[0];
  }, [provinces, selectedProvinceId]);

  const categories = useMemo(() => discoveryService.getCategories(), []);
  const districts = useMemo(() => {
    return discoveryService.getDistricts(selectedProvinceId);
  }, [selectedProvinceId]);

  const districtsMeta = useMemo(() => {
    return discoveryService.getDistrictCounts(selectedProvinceId);
  }, [selectedProvinceId]);

  const query: DiscoveryQuery = useMemo(() => ({
    provinceId: selectedProvinceId,
    category: activeCategory,
    districts: selectedDistricts,
    searchKeyword,
    sortBy,
    minRating,
  }), [selectedProvinceId, activeCategory, selectedDistricts, searchKeyword, sortBy, minRating]);

  // Query places through service seam
  const places = useMemo(() => {
    return discoveryService.getPlaces(query);
  }, [query]);

  // Deep Actions with Invariant Enforcement
  const setProvince = useCallback((provinceId: string) => {
    setSelectedProvinceId(provinceId);
    // Invariants: Reset filters and active selection when switching province
    setSelectedDistricts([]);
    setActiveCategory('all');
    setMinRating(undefined);
    setSelectedPlace(null);
  }, []);

  const setCategory = useCallback((category: PlaceCategory | 'all') => {
    setActiveCategory(category);
  }, []);

  const setDistrict = useCallback((district: string) => {
    if (district === 'ทั้งหมด') {
      setSelectedDistricts([]);
    } else {
      setSelectedDistricts([district]);
    }
  }, []);

  const setDistricts = useCallback((districtsList: string[]) => {
    setSelectedDistricts(districtsList);
  }, []);

  const toggleDistrict = useCallback((district: string) => {
    setSelectedDistricts((prev) => {
      if (prev.includes(district)) {
        return prev.filter((d) => d !== district);
      }
      return [...prev, district];
    });
  }, []);

  const setMinRatingAction = useCallback((rating: number | undefined) => {
    setMinRating(rating);
  }, []);

  const setSortByAction = useCallback((sort: 'recommended' | 'rating' | 'name') => {
    setSortBy(sort);
  }, []);

  const selectPlace = useCallback((place: Place | null) => {
    setSelectedPlace(place);
  }, []);

  const openDetail = useCallback((place: Place) => {
    setDetailPlace(place);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailPlace(null);
  }, []);

  const toggleMobileView = useCallback(() => {
    setMobileViewMode((prev) => (prev === 'list' ? 'map' : 'list'));
  }, []);

  const openFilterModal = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  const closeFilterModal = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchKeyword('');
    setActiveCategory('all');
    setSelectedDistricts([]);
    setMinRating(undefined);
    setSelectedPlace(null);
  }, []);

  return {
    places,
    activeProvince,
    provinces,
    districts,
    districtsMeta,
    categories,
    selectedPlace,
    detailPlace,
    mobileViewMode,
    isFilterModalOpen,
    query,
    actions: {
      setProvince,
      setCategory,
      setDistrict,
      setDistricts,
      toggleDistrict,
      setMinRating: setMinRatingAction,
      setSearchKeyword,
      setSortBy: setSortByAction,
      selectPlace,
      openDetail,
      closeDetail,
      toggleMobileView,
      openFilterModal,
      closeFilterModal,
      resetFilters,
    },
  };
}
