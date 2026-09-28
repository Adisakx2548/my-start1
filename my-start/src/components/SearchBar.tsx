'use client';

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
  resultCount: number;
  sortBy: 'recommended' | 'rating' | 'name';
  onChangeSort: (sort: 'recommended' | 'rating' | 'name') => void;
}

export function SearchBar({
  keyword,
  onChangeKeyword,
  resultCount,
  sortBy,
  onChangeSort,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => onChangeKeyword(e.target.value)}
          placeholder="ค้นหาสถานที่ เช่น ผาซ่อนแก้ว, กังหันลม, น้ำตก, เขาค้อ..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => onChangeKeyword('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Meta & Sort Selection */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <span className="text-xs text-slate-500 font-medium">
          พบ <strong className="text-emerald-700 font-bold">{resultCount}</strong> แห่ง
        </span>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onChangeSort(e.target.value as 'recommended' | 'rating' | 'name')}
            className="text-xs text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
          >
            <option value="recommended">แนะนำสำหรับคุณ</option>
            <option value="rating">คะแนนรีวิวสูงสุด</option>
            <option value="name">เรียงตามตัวอักษร</option>
          </select>
        </div>
      </div>
    </div>
  );
}
