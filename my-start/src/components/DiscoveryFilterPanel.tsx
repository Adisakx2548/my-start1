'use client';

import React from 'react';
import type { PlaceCategory, DiscoveryQuery, DistrictMeta } from '../types/travel';
import { SearchBar } from './SearchBar';
import { CategoryFilterPills } from './CategoryFilterPills';
import { SlidersHorizontal, MapPin, X, RotateCcw } from 'lucide-react';

interface DiscoveryFilterPanelProps {
  query: DiscoveryQuery;
  districtsMeta: DistrictMeta[];
  categories: { id: PlaceCategory | 'all'; label: string; iconName: string }[];
  resultCount: number;
  actions: {
    setSearchKeyword: (keyword: string) => void;
    setSortBy: (sortBy: 'recommended' | 'rating' | 'name') => void;
    setCategory: (category: PlaceCategory | 'all') => void;
    toggleDistrict: (district: string) => void;
    setDistricts: (districts: string[]) => void;
    openFilterModal: () => void;
    resetFilters: () => void;
  };
}

/**
 * Deep Presentation Module: DiscoveryFilterPanel
 * Redesigned with Airbnb-style Advanced Filters Button, Multi-District Pills with Counts,
 * and Active Filter dismissible chips.
 */
export function DiscoveryFilterPanel({
  query,
  districtsMeta,
  categories,
  resultCount,
  actions,
}: DiscoveryFilterPanelProps) {
  const selectedDistricts = query.districts || [];
  const activeFiltersCount =
    (selectedDistricts.length > 0 ? selectedDistricts.length : 0) +
    (query.category && query.category !== 'all' ? 1 : 0) +
    (query.minRating && query.minRating > 0 ? 1 : 0);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-5 flex flex-col gap-3.5">
      {/* Search & Sort & Advanced Filter Button Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <SearchBar
            keyword={query.searchKeyword || ''}
            onChangeKeyword={actions.setSearchKeyword}
            resultCount={resultCount}
            sortBy={query.sortBy || 'recommended'}
            onChangeSort={actions.setSortBy}
          />
        </div>

        {/* Advanced Filters Button (Airbnb-style) */}
        <button
          type="button"
          onClick={actions.openFilterModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 font-semibold text-xs shadow-xs transition-all active:scale-98 shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span>ตัวกรองขั้นสูง</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <hr className="border-slate-100" />

      {/* Category Pills */}
      <CategoryFilterPills
        activeCategory={query.category || 'all'}
        onSelectCategory={actions.setCategory}
        categories={categories}
      />

      {/* District Quick Select Row with Real Counts */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-1 shrink-0 font-medium">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>อำเภอ:</span>
        </div>

        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => actions.setDistricts([])}
            className={`px-3 py-1.5 text-xs rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
              selectedDistricts.length === 0
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <span>ทั้งหมด</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              selectedDistricts.length === 0 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {districtsMeta.find(d => d.name === 'ทั้งหมด')?.count || 0}
            </span>
          </button>

          {districtsMeta.filter(d => d.name !== 'ทั้งหมด').map((d) => {
            const isSelected = selectedDistricts.includes(d.name);
            return (
              <button
                key={d.name}
                type="button"
                onClick={() => actions.toggleDistrict(d.name)}
                className={`px-3 py-1.5 text-xs rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{d.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {d.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Chips (if any selected) */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100/80 text-xs">
          <span className="text-slate-400 font-medium">กำลังกรอง:</span>

          {selectedDistricts.map((district) => (
            <span
              key={district}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 text-[11px]"
            >
              <span>อ.{district}</span>
              <button
                type="button"
                onClick={() => actions.toggleDistrict(district)}
                className="hover:text-emerald-950 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {query.category && query.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 font-medium border border-blue-200 text-[11px]">
              <span>หมวด: {categories.find(c => c.id === query.category)?.label}</span>
              <button
                type="button"
                onClick={() => actions.setCategory('all')}
                className="hover:text-blue-950 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {query.minRating && query.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-medium border border-amber-200 text-[11px]">
              <span>⭐ {query.minRating}+</span>
            </span>
          )}

          <button
            type="button"
            onClick={actions.resetFilters}
            className="text-xs text-slate-400 hover:text-slate-700 underline ml-auto transition-colors"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}
    </div>
  );
}
