import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CoffeeLocation, ResponseData } from './types';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Heart,
  ExternalLink,
  MessageSquare,
  Coffee,
  Sparkles,
  Plus,
  Palette,
  Check,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';

interface MapLocationProps {
  location: CoffeeLocation;
  coffeeSpots?: CoffeeLocation[];
  recipientName: string;
  senderName: string;
  onConfirmDate: (
    date: string,
    time: string,
    message?: string,
    selectedLocation?: CoffeeLocation,
    colorToWear?: string
  ) => Promise<void>;
  submittedData?: ResponseData | null;
}

// Standard classic 8 crayon box colors
export const COLOR_FEELING_OPTIONS = [
  { id: 'red', name: 'Red', hex: '#E53E3E', textHex: '#FFFFFF', vibe: 'Red 🖍️' },
  { id: 'yellow', name: 'Yellow', hex: '#FACC15', textHex: '#1F242D', borderHex: '#EAB308', vibe: 'Yellow 💛' },
  { id: 'blue', name: 'Blue', hex: '#2563EB', textHex: '#FFFFFF', vibe: 'Blue 💙' },
  { id: 'green', name: 'Green', hex: '#16A34A', textHex: '#FFFFFF', vibe: 'Green 💚' },
  { id: 'orange', name: 'Orange', hex: '#EA580C', textHex: '#FFFFFF', vibe: 'Orange 🧡' },
  { id: 'purple', name: 'Purple', hex: '#9333EA', textHex: '#FFFFFF', vibe: 'Purple 💜' },
  { id: 'brown', name: 'Brown', hex: '#854D0E', textHex: '#FFFFFF', vibe: 'Brown 🤎' },
  { id: 'black', name: 'Black', hex: '#1F242D', textHex: '#FFFFFF', vibe: 'Black 🖤' },
];

const DEFAULT_VILLAMOR_SPOTS: CoffeeLocation[] = [
  {
    name: 'Pickup Coffee - Andrews Ave',
    address: 'Andrews Ave, Pasay (Near NAIA T3 & Villamor)',
    lat: 14.5200,
    lng: 121.0160,
    googleMapsUrl: 'https://maps.google.com/?q=Pickup+Coffee+Andrews+Ave+Pasay',
    note: 'Quick handcrafted Kape Kastila & Nutty Nutella coffee ☕'
  },
  {
    name: 'Café MERGE',
    address: '11th St cor. 12th St, Villamor Air Base, Pasay',
    lat: 14.5242,
    lng: 121.0158,
    googleMapsUrl: 'https://maps.google.com/?q=Cafe+MERGE+Villamor+Pasay',
    note: 'Cozy study haven & specialty coffee right in the heart of Villamor ☕✨'
  },
  {
    name: 'Cafe Prince - Villamor',
    address: '23rd St cor. 8th St, Villamor Air Base, Pasay',
    lat: 14.5246,
    lng: 121.0182,
    googleMapsUrl: 'https://maps.google.com/?q=Cafe+Prince+Villamor+Pasay',
    note: 'Aesthetic Korean-inspired cafe with cakes & specialty frappes 🍰'
  },
  {
    name: 'Kkopi.tea Villamor',
    address: '8th St / 9th St, Villamor Air Base, Pasay',
    lat: 14.5216,
    lng: 121.0138,
    googleMapsUrl: 'https://maps.google.com/?q=Kkopi.tea+Villamor+Pasay',
    note: 'Affordable handcrafted iced coffees & refreshing milk teas 🧋'
  },
  {
    name: 'Jeonbu Cafe and Tea',
    address: '21st St, Villamor Air Base, Pasay',
    lat: 14.5229,
    lng: 121.0188,
    googleMapsUrl: 'https://maps.google.com/?q=Jeonbu+Cafe+and+Tea+Pasay',
    note: 'Relaxing neighborhood cafe with matcha lattes & croffles 🥐'
  },
  {
    name: 'The Cozy Garage x Bean Hopper Cafe',
    address: '6th St / 2nd D St, Villamor Air Base, Pasay',
    lat: 14.5190,
    lng: 121.0182,
    googleMapsUrl: 'https://maps.google.com/?q=The+Cozy+Garage+Bean+Hopper+Cafe+Pasay',
    note: 'Rustic garage aesthetic with rich artisan espresso & all-day brunch 🍳☕'
  },
  {
    name: 'HOLY SIP!',
    address: '3rd St / 5th St, Villamor Air Base, Pasay',
    lat: 14.5230,
    lng: 121.0112,
    googleMapsUrl: 'https://maps.google.com/?q=HOLY+SIP+Pasay',
    note: 'Fun colorful beverages, iced espresso & sweet snacks 🍹'
  },
  {
    name: 'Euno Cafe',
    address: '3rd St, Villamor Air Base, Pasay',
    lat: 14.5223,
    lng: 121.0125,
    googleMapsUrl: 'https://maps.google.com/?q=Euno+Cafe+Villamor+Pasay',
    note: 'Charming hidden spot for quiet conversations & great coffee ☕'
  },
  {
    name: 'Starbucks - Newport World Resorts',
    address: 'Newport Blvd, Newport City, Pasay',
    lat: 14.5180,
    lng: 121.0195,
    googleMapsUrl: 'https://maps.google.com/?q=Starbucks+Newport+Mall+Pasay',
    note: 'Spacious signature cafe with cozy couches & warm pastries ☕'
  }
];

export const MapLocation: React.FC<MapLocationProps> = ({
  location,
  coffeeSpots = DEFAULT_VILLAMOR_SPOTS,
  recipientName,
  senderName,
  onConfirmDate,
  submittedData,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const defaultSuggestionName = location?.name || (coffeeSpots && coffeeSpots[0]?.name) || DEFAULT_VILLAMOR_SPOTS[0].name;

  const allSpots: CoffeeLocation[] = useMemo(() => {
    const list = [...(coffeeSpots && coffeeSpots.length > 0 ? coffeeSpots : DEFAULT_VILLAMOR_SPOTS)];
    if (location && location.name && !list.some(s => s.name.toLowerCase() === location.name.toLowerCase())) {
      list.unshift(location);
    }
    return list;
  }, [location, coffeeSpots]);

  const [activeSpot, setActiveSpot] = useState<CoffeeLocation>(() => {
    if (submittedData?.selectedLocation) return submittedData.selectedLocation;
    if (submittedData?.selectedLocationName) {
      const found = allSpots.find(s => s.name === submittedData.selectedLocationName);
      if (found) return found;
    }
    return location || allSpots[0];
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customSpotName, setCustomSpotName] = useState('');
  const [customSpotAddress, setCustomSpotAddress] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(submittedData?.colorToWear || 'Red');
  const [isCustomColor, setIsCustomColor] = useState<boolean>(() => {
    if (!submittedData?.colorToWear) return false;
    return !COLOR_FEELING_OPTIONS.some(c => c.name.toLowerCase() === submittedData.colorToWear?.toLowerCase());
  });
  const [customColorInput, setCustomColorInput] = useState<string>(() => {
    if (submittedData?.colorToWear && !COLOR_FEELING_OPTIONS.some(c => c.name.toLowerCase() === submittedData.colorToWear?.toLowerCase())) {
      return submittedData.colorToWear;
    }
    return '';
  });

  const [selectedDate, setSelectedDate] = useState<string>(submittedData?.preferredDate || defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>(submittedData?.preferredTime || '14:30');
  const [comment, setComment] = useState<string>(submittedData?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(!!submittedData);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const customMarkerRef = useRef<L.Marker | null>(null);

  const activeColorHex = useMemo(() => {
    const matched = COLOR_FEELING_OPTIONS.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());
    return matched ? matched.hex : '#8A181A';
  }, [selectedColor]);

  const createPinIcon = (isSelected: boolean, isDefaultSuggestion: boolean) => {
    const bgColor = isSelected ? '#16A34A' : isDefaultSuggestion ? '#8A181A' : '#4B5563';
    const shadowColor = isSelected
      ? 'rgba(22, 163, 74, 0.6)'
      : isDefaultSuggestion
      ? 'rgba(138, 24, 26, 0.5)'
      : 'rgba(75, 85, 99, 0.4)';

    const pulseRingHtml = isSelected
      ? `<div style="
          position: absolute;
          top: -8px;
          left: -8px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2.5px solid #22C55E;
          background: rgba(34, 197, 94, 0.25);
          animation: pulseGreenPin 1.8s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        "></div>`
      : '';

    const starBadgeHtml = isDefaultSuggestion
      ? `<div style="
          position: absolute;
          top: -5px;
          right: -5px;
          width: 18px;
          height: 18px;
          background: #F59E0B;
          color: #ffffff;
          border: 1.5px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          z-index: 4;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">★</div>`
      : '';

    return L.divIcon({
      className: isSelected ? 'custom-green-pin' : isDefaultSuggestion ? 'custom-crimson-pin' : 'custom-secondary-pin',
      html: `
        <div style="position: relative; width: 44px; height: 44px;">
          ${pulseRingHtml}
          ${starBadgeHtml}
          <div style="
            position: relative;
            z-index: 2;
            background: ${bgColor};
            width: 44px;
            height: 44px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 22px ${shadowColor};
            border: 2.5px solid #ffffff;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <span style="transform: rotate(45deg); font-size: ${isSelected ? '22px' : '18px'};">☕</span>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -44],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const initialCenter: [number, number] = [activeSpot.lat || 14.5228, activeSpot.lng || 121.0165];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 15,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    } catch (e) {
      console.error('Leaflet map error:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    allSpots.forEach((spot) => {
      const isSelected = spot.name === activeSpot.name;
      const isDefault = spot.name.toLowerCase() === defaultSuggestionName.toLowerCase();
      const icon = createPinIcon(isSelected, isDefault);
      const marker = L.marker([spot.lat, spot.lng], { icon, zIndexOffset: isSelected ? 1000 : isDefault ? 500 : 100 }).addTo(map);

      const defaultBadge = isDefault
        ? `<div style="display: inline-block; padding: 2px 8px; border-radius: 999px; background: #FEF3C7; color: #B45309; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; border: 1px solid #FDE68A;">
            ★ My Suggestion
          </div>`
        : '';

      const chosenBadge = isSelected
        ? `<div style="display: inline-block; padding: 2px 8px; border-radius: 999px; background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            ✓ Chosen Venue
          </div>`
        : '';

      const popupContent = `
        <div style="text-align: center; padding: 6px; font-family: 'Poppins', sans-serif;">
          ${chosenBadge || defaultBadge}
          <br/>
          <strong style="color: ${isSelected ? '#15803D' : '#8A181A'}; font-size: 14px; display: block; margin-top: 2px;">${spot.name}</strong>
          <span style="font-size: 11px; color: #4A5565; display: block; margin: 4px 0;">${spot.address}</span>
          ${spot.note ? `<span style="font-size: 11px; color: #6A7282; font-style: italic; display: block; margin-bottom: 6px;">${spot.note}</span>` : ''}
          <div style="margin-top: 6px; font-size: 12px; font-weight: 600; color: ${isSelected ? '#16A34A' : '#8A181A'};">
            ${isSelected ? '💖 Confirmed Meeting Spot!' : '👉 Click to Select This Spot'}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setActiveSpot(spot);
        marker.openPopup();
      });

      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current.set(spot.name, marker);
    });
  }, [allSpots, activeSpot.name, defaultSuggestionName]);

  const handleSelectSpot = (spot: CoffeeLocation) => {
    setActiveSpot(spot);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([spot.lat, spot.lng], 16, { duration: 1.2 });
    }
  };

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (!showSuggestions) return;

      const { lat, lng } = e.latlng;
      const customLocation: CoffeeLocation = {
        name: customSpotName.trim() || 'My Suggested Place 📍',
        address: customSpotAddress.trim() || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Villamor / Pasay)`,
        lat,
        lng,
        googleMapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
        note: 'Custom chosen spot on the map 💖'
      };

      if (customMarkerRef.current) {
        customMarkerRef.current.remove();
      }

      const greenIcon = createPinIcon(true, false);
      const newMarker = L.marker([lat, lng], { icon: greenIcon, zIndexOffset: 2000 }).addTo(map);
      newMarker.bindPopup(`
        <div style="text-align: center; padding: 6px; font-family: 'Poppins', sans-serif;">
          <div style="display: inline-block; padding: 2px 8px; border-radius: 999px; background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            ✓ Custom Suggested Spot
          </div>
          <br/>
          <strong style="color: #15803D; font-size: 14px; display: block; margin-top: 2px;">${customLocation.name}</strong>
        </div>
      `).openPopup();

      customMarkerRef.current = newMarker;
      setActiveSpot(customLocation);
    };

    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [showSuggestions, customSpotName, customSpotAddress]);

  const handleApplyCustomSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSpotName.trim()) return;

    const newSpot: CoffeeLocation = {
      name: customSpotName.trim(),
      address: customSpotAddress.trim() || 'Custom suggested spot (Pasay / Metro Manila)',
      lat: activeSpot.lat || 14.5242,
      lng: activeSpot.lng || 121.0158,
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(customSpotName.trim() + ' Pasay')}`,
      note: 'Personally suggested spot 💖'
    };

    setActiveSpot(newSpot);
    if (mapInstanceRef.current) {
      if (customMarkerRef.current) customMarkerRef.current.remove();
      const greenIcon = createPinIcon(true, false);
      const marker = L.marker([newSpot.lat, newSpot.lng], { icon: greenIcon, zIndexOffset: 2000 }).addTo(mapInstanceRef.current);
      marker.bindPopup(`
        <div style="text-align: center; padding: 6px; font-family: 'Poppins', sans-serif;">
          <div style="display: inline-block; padding: 2px 8px; border-radius: 999px; background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            ✓ Custom Suggested Spot
          </div>
          <br/>
          <strong style="color: #15803D; font-size: 14px; display: block; margin-top: 2px;">${newSpot.name}</strong>
        </div>
      `).openPopup();
      customMarkerRef.current = marker;
      mapInstanceRef.current.flyTo([newSpot.lat, newSpot.lng], 16, { duration: 1 });
    }
  };

  const handleSelectColorOption = (colorName: string) => {
    setSelectedColor(colorName);
    setIsCustomColor(false);
  };

  const handleCustomColorSubmit = (val: string) => {
    setCustomColorInput(val);
    if (val.trim()) {
      setSelectedColor(val.trim());
      setIsCustomColor(true);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmDate(selectedDate, selectedTime, comment.trim(), activeSpot, selectedColor);
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDateDisplay = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const commentRef = useRef<HTMLTextAreaElement>(null);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if (commentRef.current) {
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${Math.max(48, commentRef.current.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${Math.max(48, commentRef.current.scrollHeight)}px`;
    }
  }, [comment]);

  const isActiveDefaultSuggestion = activeSpot.name.toLowerCase() === defaultSuggestionName.toLowerCase();

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-2 flex flex-col items-center justify-center h-full max-h-[94vh] font-poppins overflow-hidden">
      {/* Celebration Header */}
      <div className="text-center mb-2.5">
        <h2 className="font-poppins text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 drop-shadow-md">
          It's a Coffee Date! ☕💖
        </h2>
        <p className="font-poppins text-white/85 text-xs sm:text-sm max-w-lg mx-auto">
          Here is our proposed plan. Select your preferred date, time, color to wear & let's make it official!
        </p>
      </div>

      {/* Grid Layout: Map Card + Plan Details Card */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start overflow-hidden">
        {/* Left Column: Map Container & Spot Details */}
        <div className="lg:col-span-6 sentimental-card p-3 sm:p-4 flex flex-col">
          {/* Active Spot Header Banner */}
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5 text-[#101828] font-poppins font-semibold text-xs sm:text-sm truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate font-bold text-emerald-700">{activeSpot.name}</span>
              {isActiveDefaultSuggestion && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0 border border-amber-300">
                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  <span>My Suggestion</span>
                </span>
              )}
            </div>
            {activeSpot.googleMapsUrl && (
              <a
                href={activeSpot.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-[#8A181A] hover:underline transition-colors font-poppins font-semibold shrink-0 ml-2"
              >
                <span>Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Leaflet Map Embed */}
          <div className="w-full h-[200px] sm:h-[220px] md:h-[240px] rounded-xl overflow-hidden relative border border-[#E5E7EB] shadow-inner bg-[#F7F6F3]">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
          </div>

          {/* Suggestion Toggle Bar (Chips hidden by default) */}
          <div className="mt-2.5 pt-2 border-t border-[#F3F4F6] space-y-2 font-poppins">
            <div className="flex items-center justify-between text-[11px] text-[#6A7282] px-1 font-semibold">
              <div className="flex items-center gap-1.5 truncate">
                <Coffee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Venue:</span>
                <strong className="text-emerald-800 truncate">{activeSpot.name}</strong>
              </div>

              <button
                type="button"
                onClick={() => setShowSuggestions(prev => !prev)}
                className="text-[11px] text-[#8A181A] hover:text-[#721315] font-bold flex items-center gap-1 underline underline-offset-2 cursor-pointer shrink-0 ml-2 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-[#8A181A]" />
                <span>{showSuggestions ? 'Hide options' : 'Suggest another place'}</span>
                {showSuggestions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Revealed ONLY when user clicks "Suggest another place" */}
            {showSuggestions && (
              <div className="space-y-2 pt-1 animate-fade-in">
                {/* Popular Coffee Shop Chips */}
                <div>
                  <p className="text-[10px] text-[#4A5565] font-semibold mb-1 flex items-center gap-1">
                    <span>Choose from other nearby cafes:</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-1 max-h-[85px] overflow-y-auto pr-1">
                    {allSpots.map((spot) => {
                      const isSelected = spot.name === activeSpot.name;
                      const isDefault = spot.name.toLowerCase() === defaultSuggestionName.toLowerCase();
                      return (
                        <button
                          key={spot.name}
                          type="button"
                          onClick={() => handleSelectSpot(spot)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow scale-[1.02] font-bold'
                              : isDefault
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                              : 'bg-[#F7F6F3] hover:bg-[#E5E7EB] text-[#364153] border-[#D1D5DC]'
                          }`}
                        >
                          {isDefault && <Star className={`w-2.5 h-2.5 ${isSelected ? 'text-amber-200 fill-amber-200' : 'text-amber-500 fill-amber-500'}`} />}
                          <span className="truncate max-w-[130px]">{spot.name.split('-')[0].trim()}</span>
                          {isDefault && <span className="text-[8.5px] opacity-80">(My Suggestion)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Cafe Input Form */}
                <form onSubmit={handleApplyCustomSpot} className="p-2 rounded-xl bg-emerald-50/90 border border-emerald-200 space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-emerald-900 font-bold text-[10px]">
                    <Plus className="w-3 h-3 text-emerald-700" />
                    <span>Or type your preferred coffee spot / place:</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <input
                      type="text"
                      placeholder="Cafe / Place Name"
                      value={customSpotName}
                      onChange={(e) => setCustomSpotName(e.target.value)}
                      className="flex-1 px-2 py-1 rounded-lg bg-white border border-emerald-300 text-[#101828] text-xs focus:outline-none focus:border-emerald-600"
                    />
                    <input
                      type="text"
                      placeholder="Vicinity / Area (Optional)"
                      value={customSpotAddress}
                      onChange={(e) => setCustomSpotAddress(e.target.value)}
                      className="flex-1 px-2 py-1 rounded-lg bg-white border border-emerald-300 text-[#101828] text-xs focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                    >
                      Set Spot
                    </button>
                  </div>
                  <p className="text-[9px] text-emerald-700 italic">
                    💡 Tip: You can also click directly on the map above to drop a custom pin!
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Plan Details Form & Itinerary Confirmation */}
        <div className="lg:col-span-6 sentimental-card p-3.5 sm:p-4 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#101828]">
              <Calendar className="w-4 h-4 text-[#8A181A]" />
              <h3 className="font-poppins text-base sm:text-lg font-bold">Plan Details</h3>
            </div>

            {isSaved ? (
              /* Invitation Ticket View */
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB] text-center animate-fade-in my-0.5">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
                <h4 className="font-poppins font-bold text-base text-[#101828] mb-0.5">Date Confirmed! 🎉</h4>
                <p className="text-[11px] text-[#6A7282] mb-2.5">I'm so excited and looking forward to our time together.</p>

                <div className="space-y-0 border-t border-[#E5E7EB] pt-1 text-left text-xs">
                  <div className="metadata-row">
                    <span className="metadata-label w-24 shrink-0">From</span>
                    <span className="metadata-value font-semibold">{senderName}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-24 shrink-0">To</span>
                    <span className="metadata-value font-semibold">{recipientName}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-24 shrink-0">Date</span>
                    <span className="metadata-value font-semibold text-[#8A181A]">{formattedDateDisplay}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-24 shrink-0">Time</span>
                    <span className="metadata-value font-semibold text-[#8A181A]">{selectedTime}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-24 shrink-0">Location</span>
                    <span className="metadata-value font-semibold text-emerald-700 truncate">
                      {activeSpot.name} {isActiveDefaultSuggestion ? '★' : ''}
                    </span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-24 shrink-0">Color to Wear</span>
                    <span className="metadata-value font-bold text-[#8A181A] flex items-center gap-1.5 truncate">
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0 inline-block shadow-2xs"
                        style={{ backgroundColor: activeColorHex }}
                      />
                      <span>{selectedColor}</span>
                    </span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-24 shrink-0">Address</span>
                    <span className="metadata-value text-[11px] text-[#4A5565] truncate">{activeSpot.address}</span>
                  </div>
                  {comment && (
                    <div className="metadata-row">
                      <span className="metadata-label w-24 shrink-0">Note</span>
                      <span className="metadata-value italic text-[#8A181A] text-xs">"{comment}"</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsSaved(false)}
                  className="mt-3 text-xs font-poppins text-[#6A7282] hover:text-[#8A181A] underline cursor-pointer"
                >
                  Change Date / Time / Color / Note
                </button>
              </div>
            ) : (
              /* Date Form + Color Feeling Selector + Comment Box */
              <form onSubmit={handleConfirm} className="space-y-2.5">
                {/* Active Venue Banner */}
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-emerald-950 text-xs truncate flex items-center gap-1">
                        <span>{activeSpot.name}</span>
                        {isActiveDefaultSuggestion && (
                          <span className="text-[9.5px] font-normal text-amber-700 bg-amber-100 px-1 rounded">
                            (My Suggestion)
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-emerald-700 truncate">{activeSpot.address}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] uppercase shrink-0 ml-1.5">
                    Selected
                  </span>
                </div>

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-poppins font-semibold text-[#364153] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] text-xs focus:outline-none focus:border-[#8A181A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-poppins font-semibold text-[#364153] mb-1 flex items-center justify-between">
                      <span>Preferred Time</span>
                      <Clock className="w-3 h-3 text-[#8A181A]" />
                    </label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] text-xs focus:outline-none focus:border-[#8A181A]"
                    />
                  </div>
                </div>

                {/* What Color Are You Feeling? (Indicating what color to wear) */}
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7EB] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-poppins font-bold text-[#101828] flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#8A181A]" />
                      <span>What color are you feeling?</span>
                      <span className="text-[10px] font-normal text-[#6A7282]">(Color to wear)</span>
                    </label>
                    <span className="text-[10.5px] font-bold text-[#8A181A] flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block shrink-0"
                        style={{ backgroundColor: activeColorHex }}
                      />
                      <span className="truncate max-w-[100px]">{selectedColor}</span>
                    </span>
                  </div>

                  {/* Interactive Color Chips Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                    {COLOR_FEELING_OPTIONS.map((opt) => {
                      const isChosen = !isCustomColor && selectedColor.toLowerCase() === opt.name.toLowerCase();
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectColorOption(opt.name)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1.5 transition-all cursor-pointer border text-left ${
                            isChosen
                              ? 'bg-white border-[#8A181A] shadow-sm font-bold text-[#8A181A] ring-1 ring-[#8A181A]'
                              : 'bg-white/80 hover:bg-white text-[#364153] border-[#E5E7EB]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 flex items-center justify-center shadow-2xs"
                            style={{
                              backgroundColor: opt.hex,
                              borderColor: opt.borderHex || 'rgba(0,0,0,0.15)'
                            }}
                          >
                            {isChosen && <Check className="w-2.5 h-2.5 stroke-[3]" style={{ color: opt.textHex }} />}
                          </span>
                          <span className="truncate font-semibold">{opt.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Custom Color Write-In */}
                  <div className="pt-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Or type a custom color feeling (e.g. Lavender, Sky Blue)..."
                      value={customColorInput}
                      onChange={(e) => handleCustomColorSubmit(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-[#D1D5DC] text-[#101828] text-[10.5px] focus:outline-none focus:border-[#8A181A]"
                    />
                  </div>
                </div>

                {/* Note / Comment */}
                <div>
                  <label className="block text-[11px] font-poppins font-semibold text-[#364153] mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-[#8A181A]" />
                    <span>Your Note / Comment for Me (Optional)</span>
                  </label>
                  <textarea
                    ref={commentRef}
                    value={comment}
                    onChange={handleCommentChange}
                    rows={2}
                    placeholder="Leave a message, thoughts, or exciting notes..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] text-xs focus:outline-none focus:border-[#8A181A] resize-none font-poppins transition-colors placeholder:text-[#99A1AF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-crimson py-2.5 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{isSubmitting ? 'Confirming...' : 'Confirm Our Coffee Date 💖'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;
