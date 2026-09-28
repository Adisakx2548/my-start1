'use client';

import React from 'react';
import type { Province } from '../types/travel';
import { Mountain, Search, BookOpen, Compass } from 'lucide-react';
import { ProvinceSelector } from './ProvinceSelector';

interface NavbarProps {
  provinces: Province[];
  selectedProvinceId: string;
  onSelectProvince: (provinceId: string) => void;
  onOpenFilter: () => void;
}

export function Navbar({
  provinces,
  selectedProvinceId,
  onSelectProvince,
  onOpenFilter,
}: NavbarProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name (matching design) */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-800/20 shrink-0">
            <Mountain className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-emerald-950">
                Phetchabun
              </span>
              <span className="text-base sm:text-lg font-black tracking-tight text-emerald-700">
                Travel
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              เพชรบูรณ์...ใกล้กว่าที่คิด
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-emerald-800 hover:text-emerald-950 font-bold transition-colors"
          >
            หน้าแรก
          </button>
          <button
            type="button"
            onClick={() => scrollTo('places-section')}
            className="hover:text-emerald-700 transition-colors"
          >
            สถานที่ท่องเที่ยว
          </button>
          <button
            type="button"
            onClick={() => scrollTo('map-section')}
            className="hover:text-emerald-700 transition-colors"
          >
            แผนที่
          </button>
          <button
            type="button"
            onClick={onOpenFilter}
            className="hover:text-emerald-700 transition-colors"
          >
            ตัวกรองอำเภอ
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Subtle Province Switcher */}
          <div className="hidden sm:block">
            <ProvinceSelector
              provinces={provinces}
              selectedProvinceId={selectedProvinceId}
              onSelectProvince={onSelectProvince}
            />
          </div>

          {/* Search Icon button */}
          <button
            type="button"
            onClick={onOpenFilter}
            className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="ค้นหาและตัวกรอง"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Green CTA Pill Button (as in reference image) */}
          <button
            type="button"
            onClick={() => scrollTo('map-section')}
            className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-md shadow-emerald-800/20 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>วางแผนทริปของฉัน</span>
          </button>
        </div>
      </div>
    </header>
  );
}
