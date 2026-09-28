'use client';

import React from 'react';
import type { PlaceCategory } from '../types/travel';
import { Compass, Mountain, Trees, Landmark, Sparkles, Coffee } from 'lucide-react';

interface CategoryFilterPillsProps {
  activeCategory: PlaceCategory | 'all';
  onSelectCategory: (category: PlaceCategory | 'all') => void;
  categories: { id: PlaceCategory | 'all'; label: string; iconName: string }[];
}

export function CategoryFilterPills({
  activeCategory,
  onSelectCategory,
  categories
}: CategoryFilterPillsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mountain': return <Mountain className="w-4 h-4" />;
      case 'Trees': return <Trees className="w-4 h-4" />;
      case 'Landmark': return <Landmark className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                {getIcon(cat.iconName)}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
