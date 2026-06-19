"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Search, X } from "lucide-react";

interface MapPickerProps {
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  onChange: (lat: number, lng: number, address: string) => void;
  locale?: string;
}

export default function MapPicker({ lat, lng, address, onChange, locale = "ar" }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState(address ?? "");
  const [searching, setSearching] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(address ?? "");
  const ar = locale === "ar";

  const defaultLat = lat ?? 24.7136;
  const defaultLng = lng ?? 46.6753; // Riyadh default

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then(L => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([defaultLat, defaultLng], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
      markerRef.current = marker;
      mapInstance.current = map;

      if (lat && lng) {
        reverseGeocode(lat, lng);
      }

      marker.on("dragend", async () => {
        const pos = marker.getLatLng();
        const addr = await reverseGeocode(pos.lat, pos.lng);
        onChange(pos.lat, pos.lng, addr);
      });

      map.on("click", async (e: any) => {
        marker.setLatLng(e.latlng);
        const addr = await reverseGeocode(e.latlng.lat, e.latlng.lng);
        onChange(e.latlng.lat, e.latlng.lng, addr);
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=${locale}`
      );
      const data = await res.json();
      const addr = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setCurrentAddress(addr);
      return addr;
    } catch {
      const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setCurrentAddress(fallback);
      return fallback;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&accept-language=${locale}`
      );
      const data = await res.json();
      if (data[0]) {
        const { lat: newLat, lon: newLng, display_name } = data[0];
        const latNum = parseFloat(newLat);
        const lngNum = parseFloat(newLng);
        mapInstance.current?.setView([latNum, lngNum], 16);
        markerRef.current?.setLatLng([latNum, lngNum]);
        setCurrentAddress(display_name);
        onChange(latNum, lngNum, display_name);
      }
    } catch { /* ignore */ }
    setSearching(false);
  };

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-white/30" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            dir="auto"
            placeholder={ar ? "ابحث عن موقع العيادة..." : "Search clinic location..."}
            className="form-input ps-9 pe-4 text-sm w-full"
          />
        </div>
        <button type="button" onClick={handleSearch} disabled={searching}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-600/30 transition-colors disabled:opacity-50">
          {searching ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Search className="h-3.5 w-3.5" />}
          {ar ? "بحث" : "Search"}
        </button>
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-white/8" style={{ height: "260px" }}>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        <div className="absolute bottom-2 start-2 z-[1000] flex items-center gap-1.5 rounded-lg bg-[#0f1629]/90 backdrop-blur-sm border border-white/10 px-2.5 py-1.5">
          <MapPin className="h-3 w-3 text-indigo-400 shrink-0" />
          <p className="text-xs text-white/50 max-w-48 truncate">{currentAddress || (ar ? "اضغط على الخريطة لتحديد الموقع" : "Click map to set location")}</p>
        </div>
      </div>

      {currentAddress && (
        <p className="text-xs text-white/30 flex items-start gap-1.5">
          <MapPin className="h-3 w-3 text-indigo-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{currentAddress}</span>
        </p>
      )}
    </div>
  );
}
