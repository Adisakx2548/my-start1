'use client';

import React, { useEffect, useState } from 'react';
import type { Place } from '../types/travel';
import { X, Navigation, MapPin, Star, Sparkles, Compass, Map as MapIcon, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
}

export function PlaceDetailModal({ place, onClose }: PlaceDetailModalProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'googlemap'>('image');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset tab to image when place changes
  useEffect(() => {
    setActiveMediaTab('image');
  }, [place?.id]);

  if (!place) return null;

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleMapsSearch = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' เพชรบูรณ์')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Google Maps Embed URL (No API Key Required)
  const embedMapUrl = `https://maps.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}&hl=th&z=15&output=embed`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Media Container (Image or Google Maps Embed) */}
        <div className="relative aspect-[16/10] w-full bg-slate-200 overflow-hidden">
          {activeMediaTab === 'image' ? (
            <>
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full relative bg-slate-100">
              <iframe
                title={`Google Maps ${place.name}`}
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 shadow-sm border border-slate-200/80 pointer-events-none">
                Google Maps Embed (พิกัดจริง)
              </div>
            </div>
          )}

          {/* Media Tab Switcher */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveMediaTab('image')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeMediaTab === 'image'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>ภาพถ่าย</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMediaTab('googlemap')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeMediaTab === 'googlemap'
                  ? 'bg-emerald-500 text-white shadow-sm font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white/90 hover:bg-black/70 hover:text-white transition-colors backdrop-blur-md"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>

          {/* District & Category Caption (Only when on Image tab or overlaid) */}
          {activeMediaTab === 'image' && (
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 pointer-events-none">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500 text-white shadow-md mb-2">
                  {place.categoryLabel}
                </span>
                <h2 className="text-xl font-bold text-white drop-shadow-md leading-tight">
                  {place.name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>อำเภอ{place.district}, จังหวัดเพชรบูรณ์</span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-black/60 backdrop-blur-md text-white text-xs font-bold shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{place.rating.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Caption bar if on Google Map tab */}
        {activeMediaTab === 'googlemap' && (
          <div className="px-6 pt-4 pb-1 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {place.name}
              </h2>
              <span className="text-xs text-slate-500">
                อ.{place.district} • {place.categoryLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{place.rating.toFixed(1)}</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 flex-1">
          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {place.highlights.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-100 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                {tag}
              </span>
            ))}
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              เกี่ยวกับสถานที่
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {place.description}
            </p>
          </div>

          {/* Coordinates & Google Maps Info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-800">พิกัดทางภูมิศาสตร์ (GPS)</span>
                <span>{place.coordinates.lat.toFixed(5)}, {place.coordinates.lng.toFixed(5)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenGoogleMapsSearch}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>ค้นหาบน Google</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 mt-auto flex items-center gap-3">
            <button
              type="button"
              onClick={handleDirections}
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4" />
              <span>เปิด Google Maps นำทางทันที</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
