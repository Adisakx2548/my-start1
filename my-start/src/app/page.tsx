'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTravelDiscovery } from '../hooks/useTravelDiscovery';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { PlaceCard } from '../components/PlaceCard';
import { MapShowcaseSection } from '../components/MapShowcaseSection';
import { AdvancedFilterModal } from '../components/AdvancedFilterModal';
import { PlaceDetailModal } from '../components/PlaceDetailModal';
import { Footer } from '../components/Footer';
import { Mountain, ArrowRight, X, Compass, SlidersHorizontal } from 'lucide-react';

export default function TravelAppPage() {
  const {
    places,
    activeProvince,
    provinces,
    districtsMeta,
    categories,
    selectedPlace,
    detailPlace,
    isFilterModalOpen,
    query,
    actions,
  } = useTravelDiscovery();

  const selectedDistricts = query.districts || [];
  const activeFiltersCount =
    (selectedDistricts.length > 0 ? selectedDistricts.length : 0) +
    (query.category && query.category !== 'all' ? 1 : 0) +
    (query.minRating && query.minRating > 0 ? 1 : 0);

  const handleSelectCardAndScrollToMap = (place: (typeof places)[0]) => {
    actions.selectPlace(place);
    const mapEl = document.getElementById('map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        provinces={provinces}
        selectedProvinceId={activeProvince.id}
        onSelectProvince={actions.setProvince}
        onOpenFilter={actions.openFilterModal}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1">
        {/* Hero Section with Panoramic Mist Banner & Search Bar */}
        <HeroSection
          query={query}
          resultCount={places.length}
          actions={actions}
        />

        {/* Section 1: สถานที่ท่องเที่ยวยอดนิยม (Popular Attractions Grid) */}
        <section id="places-section" className="py-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                <Mountain className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  สถานที่ท่องเที่ยวยอดนิยม
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  สถานที่สวยๆ ที่ไม่ควรพลาด เมื่อมาเยือนเพชรบูรณ์ ({places.length} แห่ง)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <button
                type="button"
                onClick={actions.openFilterModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>กรองอำเภอ & รีวิว</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={actions.resetFilters}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 transition-colors px-2 py-1"
              >
                <span>ดูทั้งหมด</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs">
              <span className="text-slate-500 font-medium">กำลังแสดงเฉพาะ:</span>

              {selectedDistricts.map((district) => (
                <span
                  key={district}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white text-emerald-800 font-semibold border border-emerald-200 shadow-xs"
                >
                  <span>อ.{district}</span>
                  <button
                    type="button"
                    onClick={() => actions.toggleDistrict(district)}
                    className="hover:text-emerald-950 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {query.category && query.category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white text-blue-800 font-semibold border border-blue-200 shadow-xs">
                  <span>หมวด: {categories.find((c) => c.id === query.category)?.label}</span>
                  <button
                    type="button"
                    onClick={() => actions.setCategory('all')}
                    className="hover:text-blue-950 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {query.minRating && query.minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white text-amber-800 font-semibold border border-amber-200 shadow-xs">
                  <span>⭐ {query.minRating}+</span>
                </span>
              )}

              <button
                type="button"
                onClick={actions.resetFilters}
                className="text-xs text-slate-500 hover:text-slate-800 underline ml-auto transition-colors font-medium"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}

          {/* Card Grid (4 Columns as in reference image) */}
          {places.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs my-6">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                ลองปรับเปลี่ยนอำเภอ หรือล้างตัวกรองเพื่อค้นพบสถานที่ท่องเที่ยวใหม่ๆ ในเพชรบูรณ์
              </p>
              <button
                type="button"
                onClick={actions.resetFilters}
                className="mt-5 px-5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 rounded-2xl hover:bg-emerald-200 transition-colors"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  onSelect={handleSelectCardAndScrollToMap}
                  onOpenDetail={actions.openDetail}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 2: แผนที่สถานที่ท่องเที่ยว (Interactive Map Showcase with 2-Column Split) */}
        <MapShowcaseSection
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={actions.selectPlace}
          onOpenDetail={actions.openDetail}
          center={activeProvince.center}
          zoom={activeProvince.zoom}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={detailPlace}
        onClose={actions.closeDetail}
      />

      {/* Airbnb-style Advanced Filter Drawer */}
      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={actions.closeFilterModal}
        query={query}
        districtsMeta={districtsMeta}
        categories={categories}
        resultCount={places.length}
        actions={actions}
      />
    </div>
  );
}
