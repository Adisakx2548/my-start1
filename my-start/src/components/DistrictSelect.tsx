'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface DistrictSelectProps {
  districts: string[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export function DistrictSelect({
  districts,
  selectedDistrict,
  onSelectDistrict,
}: DistrictSelectProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-1 shrink-0 font-medium">
        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
        <span>อำเภอ:</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-max">
        {districts.map((district) => {
          const isSelected = selectedDistrict === district;
          return (
            <button
              key={district}
              type="button"
              onClick={() => onSelectDistrict(district)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-150 ${
                isSelected
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {district}
            </button>
          );
        })}
      </div>
    </div>
  );
}
