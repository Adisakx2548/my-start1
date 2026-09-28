'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Place } from '../types/travel';
import { MapPin, Navigation, Maximize2, Layers, ExternalLink } from 'lucide-react';
import L from 'leaflet';

interface InteractiveMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  onSelectPlace: (place: Place) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const TILE_LAYERS = {
  street: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap contributors',
    maxZoom: 19,
    subdomains: 'abcd',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
    subdomains: 'abcd',
  },
};

export function InteractiveMap({
  places,
  selectedPlace,
  onSelectPlace,
  center = { lat: 16.4206, lng: 101.1594 },
  zoom = 9,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map Instance
    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: false,
    });

    // Add Zoom Control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial Street Layer
    const tileLayer = L.tileLayer(TILE_LAYERS.street.url, {
      attribution: TILE_LAYERS.street.attribution,
      maxZoom: TILE_LAYERS.street.maxZoom,
      subdomains: TILE_LAYERS.street.subdomains,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Handle Map Type Switch (Street vs Satellite)
  const toggleMapType = (type: 'street' | 'satellite') => {
    if (!mapInstanceRef.current || type === mapType) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    const config = TILE_LAYERS[type];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: config.subdomains,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
    setMapType(type);
  };

  // Update Markers when `places` change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const bounds = L.latLngBounds([]);

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const isFeatured = place.isFeatured;

      // Create Custom SVG Marker Icon
      const markerColor = isSelected ? '#10b981' : isFeatured ? '#f59e0b' : '#3b82f6';
      const markerSize = isSelected ? 38 : 30;

      const customHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${markerSize}px;
          height: ${markerSize}px;
          border-radius: 50%;
          background: ${markerColor};
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.2s ease;
          ${isSelected ? 'transform: scale(1.15); ring: 4px rgba(16,185,129,0.4);' : ''}
        ">
          <svg width="${markerSize * 0.5}" height="${markerSize * 0.5}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-pin-marker',
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
        popupAnchor: [0, -markerSize / 2],
      });

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: customIcon,
      }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: inherit; width: 210px; padding: 2px;">
          <img src="${place.imageUrl}" style="width: 100%; height: 105px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" alt="${place.name}"/>
          <div style="font-weight: 700; font-size: 13px; color: #1e293b; margin-bottom: 2px;">${place.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">อ.${place.district} • ⭐ ${place.rating.toFixed(1)}</div>
          <p style="font-size: 11px; color: #475569; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0 0 8px 0;">${place.description}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 4px; background: #059669; color: white; padding: 6px 10px; border-radius: 6px; font-size: 11px; text-decoration: none; font-weight: 600;">
            <span>เปิด Google Maps นำทาง</span>
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 230 });

      marker.on('click', () => {
        onSelectPlace(place);
      });

      markersRef.current.set(place.id, marker);
      bounds.extend([place.coordinates.lat, place.coordinates.lng]);
    });

    // If places exist, optionally adjust bounds on initial or filtered load
    if (places.length > 0 && !selectedPlace) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [places, mapReady]);

  // Fly to selected place when selected from card list
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace || !mapReady) return;

    map.flyTo([selectedPlace.coordinates.lat, selectedPlace.coordinates.lng], 14, {
      duration: 1.2,
    });

    const marker = markersRef.current.get(selectedPlace.id);
    if (marker) {
      marker.openPopup();
    }
  }, [selectedPlace, mapReady]);

  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map || places.length === 0) return;
    const bounds = L.latLngBounds(places.map((p) => [p.coordinates.lat, p.coordinates.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  };

  // Open Google Maps in new tab for current active place or region
  const handleOpenGoogleMaps = () => {
    let targetUrl = `https://www.google.com/maps/@${center.lat},${center.lng},10z`;
    if (selectedPlace) {
      targetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name + ' เพชรบูรณ์')}`;
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-100 overflow-hidden rounded-2xl shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Layer Switcher (Street / Satellite) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-md border border-slate-200/80">
        <button
          type="button"
          onClick={() => toggleMapType('street')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            mapType === 'street'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>🗺️ แผนที่</span>
        </button>
        <button
          type="button"
          onClick={() => toggleMapType('satellite')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            mapType === 'satellite'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>🛰️ ดาวเทียม</span>
        </button>
      </div>

      {/* Action Controls (Google Maps & Reset Overview) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleOpenGoogleMaps}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
          title="เปิดดูใน Google Maps"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          <span>ดูใน Google Maps</span>
        </button>

        <button
          type="button"
          onClick={handleResetView}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
          title="ดูภาพรวมทั้งจังหวัด"
        >
          <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>ภาพรวม</span>
        </button>
      </div>

      {/* Place Indicator banner if selected */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 z-10 max-w-[280px] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-emerald-300 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="truncate text-xs">
            <span className="font-bold text-slate-800 block truncate">{selectedPlace.name}</span>
            <span className="text-[11px] text-slate-500">อ.{selectedPlace.district} • พิกัดพร้อมนำทาง</span>
          </div>
        </div>
      )}
    </div>
  );
}
