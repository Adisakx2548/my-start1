'use client';

import React from 'react';
import type { Province } from '../types/travel';
import { MapPin, ChevronDown, Check } from 'lucide-react';

interface ProvinceSelectorProps {
  provinces: Province[];
  selectedProvinceId: string;
  onSelectProvince: (provinceId: string) => void;
}

export function ProvinceSelector({
  provinces,
  selectedProvinceId,
  onSelectProvince,
}: ProvinceSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentProvince = provinces.find((p) => p.id === selectedProvinceId) || provinces[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-300/60 transition-all font-semibold text-xs"
      >
        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
        <span>จ.{currentProvince.nameTh}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              เลือกจังหวัดปลายทาง
            </div>
            {provinces.map((prov) => {
              const isSelected = prov.id === selectedProvinceId;
              const hasData = prov.id === 'phetchabun';
              return (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => {
                    onSelectProvince(prov.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                    isSelected ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>จังหวัด{prov.nameTh} ({prov.nameEn})</span>
                    {!hasData && (
                      <span className="text-[10px] text-amber-600 font-normal">กำลังรวบรวมข้อมูล</span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
