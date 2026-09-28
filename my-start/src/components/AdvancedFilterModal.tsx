'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { PlaceCategory, DistrictMeta, DiscoveryQuery } from '../types/travel';
import { X, Search, Check, Star, RotateCcw, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: DiscoveryQuery;
  districtsMeta: DistrictMeta[];
  categories: { id: PlaceCategory | 'all'; label: string; iconName: string }[];
  resultCount: number;
  actions: {
    setDistricts: (districts: string[]) => void;
    setCategory: (category: PlaceCategory | 'all') => void;
    setMinRating: (rating: number | undefined) => void;
    resetFilters: () => void;
  };
}

export function AdvancedFilterModal({
  isOpen,
  onClose,
  query,
  districtsMeta,
  categories,
  resultCount,
  actions,
}: AdvancedFilterModalProps) {
  const [districtSearch, setDistrictSearch] = useState('');
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Selected districts set
  const selectedDistricts = useMemo(() => {
    if (query.districts && query.districts.length > 0) {
      return new Set(query.districts);
    }
    if (query.district && query.district !== 'ทั้งหมด') {
      return new Set([query.district]);
    }
    return new Set<string>();
  }, [query.districts, query.district]);

  // Filter districts by autocomplete search
  const filteredDistricts = useMemo(() => {
    return districtsMeta.filter((d) => {
      if (d.name === 'ทั้งหมด') return false; // Handled separately
      if (!districtSearch.trim()) return true;
      return d.name.toLowerCase().includes(districtSearch.toLowerCase().trim());
    });
  }, [districtsMeta, districtSearch]);

  if (!isOpen) return null;

  const handleToggleDistrict = (districtName: string) => {
    const next = new Set(selectedDistricts);
    if (next.has(districtName)) {
      next.delete(districtName);
    } else {
      next.add(districtName);
    }
    actions.setDistricts(Array.from(next));
  };

  const handleSelectAllDistricts = () => {
    actions.setDistricts([]);
  };

  const activeFilterCount =
    (selectedDistricts.size > 0 ? 1 : 0) +
    (query.category && query.category !== 'all' ? 1 : 0) +
    (query.minRating && query.minRating > 0 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">ตัวกรองขั้นสูง (Filters)</h3>
              <p className="text-[11px] text-slate-400">เลือกอำเภอ หมวดหมู่ และคะแนนรีวิวตามใจชอบ</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* Section 1: Districts (อำเภอ) with Autocomplete & Multi-select */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>อำเภอ (เลือกได้หลายอำเภอ)</span>
                {selectedDistricts.size > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    เลือก {selectedDistricts.size} อำเภอ
                  </span>
                )}
              </label>

              {selectedDistricts.size > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllDistricts}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  เลือกทุกอำเภอ
                </button>
              )}
            </div>

            {/* Autocomplete Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="พิมพ์ค้นหาชื่ออำเภอ เช่น เขาค้อ, หล่มสัก..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              {districtSearch && (
                <button
                  type="button"
                  onClick={() => setDistrictSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* District Chips Grid with Real Counts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={handleSelectAllDistricts}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                  selectedDistricts.size === 0
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>ทุกอำเภอ</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono">
                  {districtsMeta.find((d) => d.name === 'ทั้งหมด')?.count || 0}
                </span>
              </button>

              {filteredDistricts.map((d) => {
                const isChecked = selectedDistricts.has(d.name);
                return (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => handleToggleDistrict(d.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-500 text-white font-semibold shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span className="truncate">{d.name}</span>
                    </div>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ml-1 ${
                        isChecked
                          ? 'bg-emerald-600 text-emerald-100'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {d.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Categories (หมวดหมู่) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              หมวดหมู่สถานที่
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = (query.category || 'all') === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => actions.setCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Rating Threshold (คะแนนรีวิว) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              คะแนนรีวิวขั้นต่ำ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'ทั้งหมด', value: undefined },
                { label: '⭐ 4.0 ขึ้นไป', value: 4.0 },
                { label: '⭐ 4.5 ดาวเด่น', value: 4.5 },
              ].map((opt) => {
                const isSelected = query.minRating === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => actions.setMinRating(opt.value)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={actions.resetFilters}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2 px-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างทั้งหมด</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 max-w-[240px] py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] text-center"
          >
            แสดงผล {resultCount} สถานที่
          </button>
        </div>
      </div>
    </div>
  );
}
