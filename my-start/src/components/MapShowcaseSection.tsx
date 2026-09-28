'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Place } from '../types/travel';
import { MapPin, Navigation, ArrowRight, Heart, ExternalLink, Sparkles } from 'lucide-react';

// SSR-Safe dynamic import for Leaflet map component
const InteractiveMap = dynamic(
  () => import('./InteractiveMap').then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[380px] bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center text-slate-400 text-xs">
        กำลังโหลดแผนที่ท่องเที่ยว...
      </div>
    ),
  }
);

interface MapShowcaseSectionProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onOpenDetail: (place: Place) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function MapShowcaseSection({
  places,
  selectedPlace,
  onSelectPlace,
  onOpenDetail,
  center,
  zoom,
}: MapShowcaseSectionProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // If no place is selected, pick the first featured place or first place
  const activePlace = selectedPlace || places.find((p) => p.isFeatured) || places[0];

  const handleDirections = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="map-section" className="py-12 border-t border-slate-200/80 scroll-mt-20">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold shrink-0">
          <MapPin className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            แผนที่สถานที่ท่องเที่ยว
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ค้นหาสถานที่ท่องเที่ยวบนแผนที่แบบอินเทอร์แอคทีฟ คลิกหมุดเพื่อดูข้อมูลและเส้นทาง
          </p>
        </div>
      </div>

      {/* 2-Column Split: Interactive Map on Left, Showcase Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Leaflet Map (7 cols) */}
        <div className="lg:col-span-7 h-[380px] sm:h-[450px] lg:h-[480px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
          <InteractiveMap
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={onSelectPlace}
            center={center}
            zoom={zoom}
          />
        </div>

        {/* Right Column: Selected Place Showcase Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          {activePlace ? (
            <div className="h-full bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 flex flex-col justify-between overflow-hidden">
              <div>
                {/* Showcase Photo */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-xs mb-4">
                  <img
                    src={activePlace.imageUrl}
                    alt={activePlace.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Heart Favorite */}
                  <button
                    type="button"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all active:scale-90"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white/95 text-slate-800 backdrop-blur-md shadow-xs">
                      {activePlace.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Title & Location */}
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {activePlace.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>อ.{activePlace.district} • เพชรบูรณ์</span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {activePlace.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {activePlace.highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs rounded-full bg-sky-50 text-sky-700 border border-sky-100 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Big Green CTA Button */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenDetail(activePlace)}
                  className="flex-1 py-3 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>ดูเส้นทาง & รายละเอียด</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDirections(activePlace)}
                  className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  title="เปิด Google Maps นำทาง"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                  <span>นำทาง</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-3xl border border-slate-200/80 p-8 flex items-center justify-center text-center text-slate-400 text-xs">
              เลือกสถานที่บนแผนที่เพื่อดูข้อมูลสรุป
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
