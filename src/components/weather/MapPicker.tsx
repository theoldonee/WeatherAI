"use client";

import { useEffect, useRef } from "react";
import { MapPinIcon } from "lucide-react";

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  isLoading: boolean;
}

/**
 * MapPicker — Interactive Leaflet map for coordinate selection.
 *
 * Loaded dynamically (next/dynamic ssr:false) because Leaflet
 * requires the browser window object. User clicks anywhere on the
 * map to place a pin, which fires onLocationSelect(lat, lng).
 *
 * Default view: Mauritius (-20.2, 57.5) — matches the test scenarios.
 * Uses free OpenStreetMap tiles (no API key required).
 */
export function MapPicker({
  latitude,
  longitude,
  onLocationSelect,
  isLoading,
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Store refs so we can update them without re-mounting
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;
    if (mapRef.current) return; // already initialised

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix Leaflet default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current!).setView(
        [-20.2, 57.5],
        5
      );
      mapRef.current = map;

      // Free OpenStreetMap tiles — no API key needed
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Click handler: place/move pin and emit coordinates
      map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }

        onLocationSelect(
          parseFloat(lat.toFixed(4)),
          parseFloat(lng.toFixed(4))
        );
      });
    });

    return () => {
      // Cleanup on unmount
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // onLocationSelect is stable via useCallback in parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If parent resets coordinates, remove the marker
  useEffect(() => {
    if (latitude === null && longitude === null && markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [latitude, longitude]);

  return (
    <div className="flex flex-col gap-3">
      {/* Map container */}
      <div
        className="relative rounded-none border border-border overflow-hidden"
        style={{ height: "320px" }}
      >
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{ zIndex: 0 }}
        />

        {/* Overlay when loading to prevent clicks mid-request */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground animate-pulse">
              Fetching forecast…
            </p>
          </div>
        )}
      </div>

      {/* Coordinate readout */}
      <div className="flex items-center gap-2 min-h-[1.5rem]">
        <MapPinIcon className="size-3.5 text-muted-foreground shrink-0" />
        {latitude !== null && longitude !== null ? (
          <p className="text-xs text-foreground font-mono">
            <span className="font-semibold">Lat:</span> {latitude}&nbsp;&nbsp;
            <span className="font-semibold">Lng:</span> {longitude}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Click anywhere on the map to place a pin
          </p>
        )}
      </div>
    </div>
  );
}
