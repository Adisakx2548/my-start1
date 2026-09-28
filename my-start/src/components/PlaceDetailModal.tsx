'use client';

import React, { useEffect, useState } from 'react';
import type { Place } from '../types/travel';
import {
  X,
  Navigation,
  MapPin,
  Star,
  Sparkles,
  Compass,
  Map as MapIcon,
  Image as ImageIcon,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ThumbsUp,
  Images
} from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
}

export function PlaceDetailModal({ place, onClose }: PlaceDetailModalProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'googlemap'>('image');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset tab to image and update photo when place changes
  useEffect(() => {
    setActiveMediaTab('image');
    if (place?.imageUrl) {
      setSelectedPhoto(place.imageUrl);
    }
  }, [place?.id, place?.imageUrl]);

  if (!place) return null;

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleMapsSearch = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' เพชรบูรณ์')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Gallery list: main image + gallery images
  const allPhotos = Array.from(
    new Set([place.imageUrl, ...(place.galleryImages || [])])
  ).filter(Boolean);

  // Google Maps Embed URL
  const embedMapUrl = `https://maps.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}&hl=th&z=15&output=embed`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Media Showcase Container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-200 overflow-hidden shrink-0">
          {activeMediaTab === 'image' ? (
            <>
              <img
                src={selectedPhoto || place.imageUrl}
                alt={place.name}
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => {
                  setSelectedPhoto('/images/places/default.jpg');
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-black/30 pointer-events-none" />

              {/* Sample Photo Thumbnails Bar */}
              {allPhotos.length > 1 && (
                <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20">
                  <span className="text-[10px] font-bold text-white/90 px-1.5 flex items-center gap-1">
                    <Images className="w-3 h-3 text-emerald-400" />
                    <span>รูปตัวอย่าง</span>
                  </span>
                  {allPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(photo)}
                      className={`relative w-9 h-7 rounded-lg overflow-hidden border transition-all ${
                        selectedPhoto === photo
                          ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-105'
                          : 'border-white/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Sample ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
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
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMediaTab === 'image'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>ภาพถ่าย & แกลเลอรี</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMediaTab('googlemap')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMediaTab === 'googlemap'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>แผนที่นำทาง</span>
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

          {/* District & Category Caption (When on Image tab) */}
          {activeMediaTab === 'image' && (
            <div className="absolute bottom-3 left-4 right-44 flex items-end justify-between gap-2 pointer-events-none">
              <div>
                <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500 text-white shadow-md mb-1.5">
                  {place.categoryLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md leading-tight line-clamp-1">
                  {place.name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>อำเภอ{place.district}, จังหวัดเพชรบูรณ์</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Caption bar if on Google Map tab */}
        {activeMediaTab === 'googlemap' && (
          <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between">
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
        <div className="p-5 sm:p-7 flex flex-col gap-6 flex-1">
          {/* Rating & Highlight Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{place.rating.toFixed(1)} ({place.reviewCount} รีวิว)</span>
            </div>
            {place.highlights.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Section: จุดเด่นและข้อดีของสถานที่ (Pros & Advantages) */}
          {place.pros && place.pros.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 sm:p-5">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-emerald-700" />
                <span>จุดเด่นและข้อดีของสถานที่ท่องเที่ยวนี้</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {place.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: ประวัติความเป็นมา (History & Storytelling) */}
          <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>ประวัติความเป็นมาและเรื่องราวท้องถิ่น</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line text-justify">
              {place.history || place.description}
            </p>
          </div>

          {/* Section: ข้อมูลท่องเที่ยวเชิงลึก (Best Time / Tips / Amenities) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Best Time to Visit */}
            {place.bestTimeToVisit && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-950">
                <Calendar className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sky-900 mb-0.5">ช่วงเวลาที่แนะนำให้ไป</span>
                  <span className="leading-relaxed text-slate-700">{place.bestTimeToVisit}</span>
                </div>
              </div>
            )}

            {/* Traveler Tips */}
            {place.tips && place.tips.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 text-xs text-orange-950">
                <span className="font-bold flex items-center gap-1 text-orange-900 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>คำแนะนำ & ข้อควรระวัง</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                  {place.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Amenities */}
          {place.amenities && place.amenities.length > 0 && (
            <div className="pt-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                สิ่งอำนวยความสะดวกในพื้นที่
              </span>
              <div className="flex flex-wrap gap-1.5">
                {place.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-xl bg-slate-100 text-slate-700 font-medium border border-slate-200/80"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Coordinates & Google Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block text-slate-800">พิกัดทางภูมิศาสตร์ (GPS)</span>
                <span>{place.coordinates.lat.toFixed(5)}, {place.coordinates.lng.toFixed(5)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenGoogleMapsSearch}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>ค้นหาเพิ่มเติมบน Google</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 mt-auto flex items-center gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDirections}
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4" />
              <span>เปิด Google Maps นำทาง</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
