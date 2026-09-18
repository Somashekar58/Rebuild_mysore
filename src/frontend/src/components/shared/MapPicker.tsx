import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';

// Custom Pin Icon for Leaflet
const customPinIcon = L.divIcon({
  html: `<div style="background-color: #245b41; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid white;">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  className: 'custom-leaflet-pin',
  iconSize: [34, 34],
  iconAnchor: [17, 34]
});

interface MapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number, approximateAddress?: string) => void;
}

function LocationMarker({
  lat,
  lng,
  onChange
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return <Marker position={[lat, lng]} icon={customPinIcon} />;
}

export const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, onChange }) => {
  const [isLocating, setIsLocating] = useState(false);

  // Default Mysuru center
  const centerLat = lat || 12.2958;
  const centerLng = lng || 76.6394;

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        onChange(pos.coords.latitude, pos.coords.longitude, 'Detected from device GPS');
      },
      (err) => {
        setIsLocating(false);
        // Fallback to Kuvempunagar if permission denied
        onChange(12.2890, 76.6280, 'Kuvempunagar, Mysuru (Default Demo Location)');
      },
      { timeout: 8000 }
    );
  };

  const predefinedMysoreWards = [
    { name: 'Kuvempunagar', lat: 12.2890, lng: 76.6280 },
    { name: 'Vijayanagar', lat: 12.3275, lng: 76.6210 },
    { name: 'Gokulam', lat: 12.3315, lng: 76.6360 },
    { name: 'Hebbal Industrial', lat: 12.3550, lng: 76.6120 },
    { name: 'Nazarbad & Heritage', lat: 12.3025, lng: 76.6640 }
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-charcoal-700 font-medium">
          <Compass className="w-4 h-4 text-forest-700" />
          <span>Click anywhere on the Mysuru map or use GPS pin</span>
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200 transition"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Finding GPS...' : 'Use Current Location'}</span>
        </button>
      </div>

      <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-sand-300 shadow-inner relative">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            lat={centerLat}
            lng={centerLng}
            onChange={(newLat, newLng) => onChange(newLat, newLng)}
          />
        </MapContainer>

        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono shadow-md border border-sand-200 z-[400] flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
          <span>{centerLat.toFixed(4)}° N, {centerLng.toFixed(4)}° E</span>
        </div>
      </div>

      {/* Quick Mysore Ward Shortcuts */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-charcoal-500 font-medium">Quick Jump:</span>
        {predefinedMysoreWards.map((w) => (
          <button
            key={w.name}
            type="button"
            onClick={() => onChange(w.lat, w.lng, `${w.name}, Mysuru`)}
            className="px-2 py-0.5 rounded text-[11px] bg-sand-100 hover:bg-sand-200 text-charcoal-700 border border-sand-200 transition"
          >
            {w.name}
          </button>
        ))}
      </div>
    </div>
  );
};
