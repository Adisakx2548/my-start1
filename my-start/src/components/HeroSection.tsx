'use client';

import React from 'react';
import type { PlaceCategory, DiscoveryQuery } from '../types/travel';
import { Search, SlidersHorizontal, Mountain, Landmark, Trees, Coffee, Camera, Compass } from 'lucide-react';

interface HeroSectionProps {
  query: DiscoveryQuery;
  resultCount: number;
  actions: {
    setSearchKeyword: (keyword: string) => void;
    setCategory: (category: PlaceCategory | 'all') => void;
    openFilterModal: () => void;
  };
}

export function HeroSection({ query, resultCount, actions }: HeroSectionProps) {
  const categoriesList: { id: PlaceCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'ทั้งหมด', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'mountain_view', label: 'ภูเขา', icon: <Mountain className="w-3.5 h-3.5" /> },
    { id: 'temple_culture', label: 'วัด', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'nature_park', label: 'น้ำตก', icon: <Trees className="w-3.5 h-3.5" /> },
    { id: 'lifestyle_farm', label: 'คาเฟ่', icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: 'heritage_history', label: 'จุดชมวิว', icon: <Camera className="w-3.5 h-3.5" /> },
  ];

  const selectedDistrictsCount = query.districts?.length || 0;
  const activeFiltersCount =
    (selectedDistrictsCount > 0 ? selectedDistrictsCount : 0) +
    (query.minRating && query.minRating > 0 ? 1 : 0);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl mb-12 min-h-[500px] sm:min-h-[540px] flex items-center justify-center p-6 sm:p-12">
      {/* Background Image with Rich Mountain Mist Panorama */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
          alt="Phetchabun Mountains Sea of Mist"
          className="w-full h-full object-cover object-center scale-102 transition-transform duration-1000"
        />
        {/* Gradients to match the reference design: Warm sunrise haze & deep contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
      </div>

      {/* Script Quote on bottom-right (as in reference image) */}
      <div className="absolute bottom-6 right-8 z-10 hidden md:block text-right pointer-events-none">
        <p className="font-serif italic text-white/90 text-sm sm:text-base drop-shadow-md">
          “เพชรบูรณ์... มากกว่าการเดินทาง คือความประทับใจ”
        </p>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl w-full flex flex-col items-start text-left">
        {/* Top Leaf Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-emerald-300 text-xs sm:text-sm font-semibold mb-4 border border-white/20 shadow-sm">
          <span>ธรรมชาติสวย ผู้คนน่ารัก เรื่องราวน่าค้นหา 🍃</span>
        </div>

        {/* H1 Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-[1.15]">
          เที่ยวเพชรบูรณ์ <br />
          <span className="text-emerald-300">ให้สนุกและง่ายขึ้น</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-200/90 max-w-xl font-normal leading-relaxed drop-shadow-xs">
          ค้นพบสถานที่ท่องเที่ยว วางแผนการเดินทาง และสัมผัสเสน่ห์ของเพชรบูรณ์ เมืองแห่งภูเขา สายหมอก และวัฒนธรรมท้องถิ่น
        </p>

        {/* Search Bar Bar (Floating Pill Style as in reference) */}
        <div className="mt-8 w-full bg-white p-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/40">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query.searchKeyword || ''}
            onChange={(e) => actions.setSearchKeyword(e.target.value)}
            placeholder="ค้นหาสถานที่ท่องเที่ยว ร้านอาหาร ที่พัก หรืออำเภอ..."
            className="flex-1 bg-transparent py-2.5 px-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
          />

          {/* Filter Modal Trigger */}
          <button
            type="button"
            onClick={actions.openFilterModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors shrink-0"
            title="เปิดตัวกรองอำเภอและเรตติ้ง"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">ตัวกรอง</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Green Submit/Search Button */}
          <button
            type="button"
            className="bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-full transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>ค้นหา</span>
          </button>
        </div>

        {/* Category Pills (Directly below search bar as in reference image) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {categoriesList.map((cat) => {
            const isSelected = (query.category || 'all') === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => actions.setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-150 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/30 border border-emerald-500'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
