'use client';

import React, { useState } from 'react';
import type { Place } from '../types/travel';
import { Heart, MapPin, ArrowRight, Navigation } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onSelect: (place: Place) => void;
  onOpenDetail?: (place: Place) => void;
}

export function PlaceCard({ place, isSelected, onSelect, onOpenDetail }: PlaceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={() => onSelect(place)}
      className={`group relative flex flex-col rounded-3xl bg-white border transition-all duration-300 overflow-hidden cursor-pointer ${
        isSelected
          ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/10 -translate-y-1'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={place.imageUrl}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
        />

        {/* Favorite Heart Button (Top-Right) */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all active:scale-90"
          title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
            }`}
          />
        </button>

        {/* Category Badge top-left */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white/95 text-slate-800 backdrop-blur-md shadow-xs border border-white/60">
            {place.categoryLabel}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          {/* Place Title */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {place.name}
          </h3>

          {/* District & Province */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-2 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>อ.{place.district} • เพชรบูรณ์</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {place.description}
          </p>

          {/* Tag Chips (Light blue rounded pills as in design) */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {place.highlights.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-[11px] rounded-full bg-sky-50 text-sky-700 border border-sky-100/80 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Link & Action */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail?.(place);
            }}
            className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-700 transition-colors group/link"
          >
            <span>ดูรายละเอียด</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover/link:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleDirections}
            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition-colors"
            title="เปิด Google Maps นำทาง"
          >
            <Navigation className="w-3 h-3" />
            <span>นำทาง</span>
          </button>
        </div>
      </div>
    </div>
  );
}
