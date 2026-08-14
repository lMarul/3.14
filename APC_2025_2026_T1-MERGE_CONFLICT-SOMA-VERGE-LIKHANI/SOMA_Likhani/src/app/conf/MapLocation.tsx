import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CoffeeLocation, ResponseData } from './types';
import { MapPin, Calendar, Clock, Navigation, CheckCircle2, Heart, ExternalLink, MessageSquare, Coffee, Sparkles, Plus, Compass } from 'lucide-react';

interface MapLocationProps {
  location: CoffeeLocation;
  coffeeSpots?: CoffeeLocation[];
  recipientName: string;
  senderName: string;
  onConfirmDate: (date: string, time: string, message?: string, selectedLocation?: CoffeeLocation) => Promise<void>;
  submittedData?: ResponseData | null;
}

// Highly accurate, actual cafes from Google Maps in Villamor / Newport / Pasay area
const DEFAULT_VILLAMOR_SPOTS: CoffeeLocation[] = [
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
    name: 'Brew Bottle',
    address: 'Near Andrews Ave / Newport Blvd, Pasay',
    lat: 14.5186,
    lng: 121.0146,
    googleMapsUrl: 'https://maps.google.com/?q=Brew+Bottle+Pasay',
    note: 'Signature bottled cold brews & Spanish lattes on the go ⚡'
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
    name: 'Saing Cafe',
    address: 'Near Almazor St / Andrews Ave, Pasay',
    lat: 14.5208,
    lng: 121.0118,
    googleMapsUrl: 'https://maps.google.com/?q=Saing+Cafe+Pasay',
    note: 'Homey meals & brewed coffee in a warm local setting 🍲'
  },
  {
    name: 'Dae Beauty Cafe',
    address: 'Andrews Ave Vicinity, Pasay',
    lat: 14.5213,
    lng: 121.0110,
    googleMapsUrl: 'https://maps.google.com/?q=Dae+Beauty+Cafe+Pasay',
    note: 'Chic aesthetic cafe with beauty-inspired wellness drinks & lattes ✨'
  },
  {
    name: 'Pickup Coffee - Andrews Ave',
    address: 'Andrews Ave, Pasay (Near NAIA T3 & Newport)',
    lat: 14.5200,
    lng: 121.0160,
    googleMapsUrl: 'https://maps.google.com/?q=Pickup+Coffee+Andrews+Ave+Pasay',
    note: 'Quick handcrafted Kape Kastila & Nutty Nutella coffee ☕'
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

  // Combine primary location with any additional coffee spots ensuring no duplicates
  const allSpots: CoffeeLocation[] = React.useMemo(() => {
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

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customSpotName, setCustomSpotName] = useState('');
  const [customSpotAddress, setCustomSpotAddress] = useState('');

  const [selectedDate, setSelectedDate] = useState<string>(submittedData?.preferredDate || defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>(submittedData?.preferredTime || '14:30');
  const [comment, setComment] = useState<string>(submittedData?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(!!submittedData);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const customMarkerRef = useRef<L.Marker | null>(null);

  // Create custom pin icons (Default Crimson vs Selected Green with Pulse Ring)
  const createPinIcon = (isSelected: boolean) => {
    const bgColor = isSelected ? '#16A34A' : '#8A181A'; // Green-600 vs Crimson
    const shadowColor = isSelected ? 'rgba(22, 163, 74, 0.6)' : 'rgba(138, 24, 26, 0.4)';
    const ringHtml = isSelected
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

    return L.divIcon({
      className: isSelected ? 'custom-green-pin' : 'custom-crimson-pin',
      html: `
        <div style="position: relative; width: 44px; height: 44px;">
          ${ringHtml}
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
            transform-origin: 50% 50%;
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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      // Centered on Villamor / Pasay / Newport vicinity
      const initialCenter: [number, number] = [activeSpot.lat || 14.5228, activeSpot.lng || 121.0165];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 15,
        scrollWheelZoom: true, // Enable mouse wheel scroll zoom directly over map
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Fix size calculation after mounting
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    } catch (e) {
      console.error('Leaflet map initialization note:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers on Spot Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Render markers for all pre-marked spots
    allSpots.forEach((spot) => {
      const isSelected = spot.name === activeSpot.name;
      const icon = createPinIcon(isSelected);
      const marker = L.marker([spot.lat, spot.lng], { icon, zIndexOffset: isSelected ? 1000 : 100 }).addTo(map);

      const popupContent = `
        <div style="text-align: center; padding: 6px; font-family: 'Poppins', sans-serif;">
          <div style="display: inline-block; padding: 2px 8px; border-radius: 999px; background: ${isSelected ? '#DCFCE7' : '#F3F4F6'}; color: ${isSelected ? '#15803D' : '#6A7282'}; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            ${isSelected ? '✓ Chosen Venue' : 'Available Spot'}
          </div>
          <br/>
          <strong style="color: ${isSelected ? '#15803D' : '#8A181A'}; font-size: 14px; display: block; margin-top: 2px;">${spot.name}</strong>
          <span style="font-size: 11px; color: #4A5565; display: block; margin: 4px 0;">${spot.address}</span>
          ${spot.note ? `<span style="font-size: 11px; color: #6A7282; font-style: italic; display: block; margin-bottom: 6px;">${spot.note}</span>` : ''}
          <div style="margin-top: 6px; font-size: 12px; font-weight: 600; color: ${isSelected ? '#16A34A' : '#8A181A'};">
            ${isSelected ? '💖 Our Confirmed Meeting Spot!' : '👉 Click to Select This Spot'}
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
  }, [allSpots, activeSpot.name]);

  // Center smoothly on spot selection change
  const handleSelectSpot = (spot: CoffeeLocation) => {
    setActiveSpot(spot);
    setIsCustomMode(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([spot.lat, spot.lng], 16, { duration: 1.2 });
    }
  };

  // Map Click Listener to let user click ANY spot on the map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const onMapClick = (e: L.LeafletMouseEvent) => {
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

      const greenIcon = createPinIcon(true);
      const newMarker = L.marker([lat, lng], { icon: greenIcon, zIndexOffset: 2000 }).addTo(map);
      newMarker.bindPopup(`
        <div style="text-align: center; padding: 6px; font-family: 'Poppins', sans-serif;">
          <div style="display: inline-block; padding: 2px 8px; border-radius: 999px; background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            ✓ Custom Suggested Spot
          </div>
          <br/>
          <strong style="color: #15803D; font-size: 14px; display: block; margin-top: 2px;">${customLocation.name}</strong>
          <span style="font-size: 11px; color: #4A5565; display: block; margin: 4px 0;">${customLocation.address}</span>
          <div style="margin-top: 6px; font-size: 12px; font-weight: 600; color: #16A34A;">
            💖 Custom Meeting Spot Selected!
          </div>
        </div>
      `).openPopup();

      customMarkerRef.current = newMarker;
      setActiveSpot(customLocation);
      setIsCustomMode(true);
    };

    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [customSpotName, customSpotAddress]);

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
      const greenIcon = createPinIcon(true);
      const marker = L.marker([newSpot.lat, newSpot.lng], { icon: greenIcon, zIndexOffset: 2000 }).addTo(mapInstanceRef.current);
      marker.bindPopup(`
        <div style="text-align: center; padding: 6px; font-family: 'Poppins', sans-serif;">
          <div style="display: inline-block; padding: 2px 8px; border-radius: 999px; background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            ✓ Custom Suggested Spot
          </div>
          <br/>
          <strong style="color: #15803D; font-size: 14px; display: block; margin-top: 2px;">${newSpot.name}</strong>
          <span style="font-size: 11px; color: #4A5565; display: block; margin: 4px 0;">${newSpot.address}</span>
        </div>
      `).openPopup();
      customMarkerRef.current = marker;
      mapInstanceRef.current.flyTo([newSpot.lat, newSpot.lng], 16, { duration: 1 });
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmDate(selectedDate, selectedTime, comment.trim(), activeSpot);
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
      commentRef.current.style.height = `${Math.max(64, commentRef.current.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${Math.max(64, commentRef.current.scrollHeight)}px`;
    }
  }, [comment]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 flex flex-col items-center justify-center min-h-[85vh] font-poppins">
      {/* Celebration Header */}
      <div className="text-center mb-6">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">
          It's a Coffee Date!
        </h2>
        <p className="font-poppins text-white/80 text-sm sm:text-base max-w-xl mx-auto">
          Here is our proposed location. Choose your preferred date, time & leave a message below to seal our plans!
        </p>
      </div>

      {/* Grid Layout: Map Card (Wider Crosswise) + Date Selector */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container - Crosswise Elongated Layout */}
        <div className="lg:col-span-8 sentimental-card p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 text-[#101828] font-poppins font-semibold text-sm sm:text-base truncate">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate font-bold text-emerald-700">{activeSpot.name}</span>
            </div>
            {activeSpot.googleMapsUrl && (
              <a
                href={activeSpot.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#8A181A] hover:underline transition-colors font-poppins font-semibold shrink-0 ml-2"
              >
                <span>Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Leaflet Map Embed - Crosswise Wide Landscape Viewport */}
          <div className="w-full h-[280px] sm:h-[320px] md:h-[340px] rounded-2xl overflow-hidden relative border border-[#E5E7EB] shadow-inner bg-[#F7F6F3]">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
          </div>

          {/* Spot Selector Chips below Map - Multi-layer Responsive Wrap Grid */}
          <div className="mt-3 pt-2.5 border-t border-[#F3F4F6] space-y-2 font-poppins">
            <div className="flex items-center justify-between text-[11px] text-[#6A7282] px-1 font-semibold">
              <span className="flex items-center gap-1.5 truncate">
                <Coffee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Selected:</span>
                <strong className="text-emerald-700 truncate">{activeSpot.name}</strong>
              </span>

              <button
                type="button"
                onClick={() => setIsCustomMode(prev => !prev)}
                className="text-[11px] text-[#8A181A] hover:text-[#721315] font-bold flex items-center gap-1 underline underline-offset-2 cursor-pointer shrink-0 ml-2"
              >
                <Plus className="w-3 h-3" />
                <span>{isCustomMode ? 'Show List' : 'Suggest Another Place'}</span>
              </button>
            </div>

            {/* If user clicks 'Suggest Another Place', show quick custom entry form */}
            {isCustomMode ? (
              <form onSubmit={handleApplyCustomSpot} className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2 animate-fade-in text-xs font-poppins">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Suggest your favorite coffee spot / cafe:</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Cafe / Place Name (e.g. My Favorite Cafe)"
                    value={customSpotName}
                    onChange={(e) => setCustomSpotName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-[#101828] text-xs focus:outline-none focus:border-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="Location / Vicinity (Optional)"
                    value={customSpotAddress}
                    onChange={(e) => setCustomSpotAddress(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-[#101828] text-xs focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm"
                  >
                    Set Spot
                  </button>
                </div>
                <p className="text-[10px] text-emerald-700/90 italic">
                  💡 Tip: You can also tap anywhere on the map above to drop a custom green pin!
                </p>
              </form>
            ) : (
              /* Multi-Row / Multi-Layer Wrapped Chip Cloud */
              <div className="flex flex-wrap items-center gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {allSpots.map((spot) => {
                  const isSelected = spot.name === activeSpot.name;
                  return (
                    <button
                      key={spot.name}
                      type="button"
                      onClick={() => handleSelectSpot(spot)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105 font-bold'
                          : 'bg-[#F7F6F3] hover:bg-[#E5E7EB] text-[#364153] border-[#D1D5DC]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : 'bg-[#8A181A]'}`} />
                      <span className="truncate max-w-[170px]">{spot.name.split('-')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Date Selector & Comment Form / Invitation Ticket */}
        <div className="lg:col-span-4 sentimental-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#101828]">
              <Calendar className="w-5 h-5 text-[#8A181A]" />
              <h3 className="font-poppins text-xl font-bold">Plan Details</h3>
            </div>

            {isSaved ? (
              /* Invitation Ticket View */
              <div className="p-5 rounded-2xl bg-[#F7F6F3] border border-[#E5E7EB] text-center animate-fade-in my-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-poppins font-bold text-lg text-[#101828] mb-1">Date Confirmed!</h4>
                <p className="text-xs text-[#6A7282] mb-4">I'm so looking forward to seeing you.</p>

                <div className="space-y-0 border-t border-[#E5E7EB] pt-2 text-left">
                  <div className="metadata-row">
                    <span className="metadata-label w-28 shrink-0">Invitation From</span>
                    <span className="metadata-value font-semibold">{senderName}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-28 shrink-0">Recipient</span>
                    <span className="metadata-value font-semibold">{recipientName}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-28 shrink-0">Date</span>
                    <span className="metadata-value font-semibold text-[#8A181A]">{formattedDateDisplay}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-28 shrink-0">Time</span>
                    <span className="metadata-value font-semibold text-[#8A181A]">{selectedTime}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-28 shrink-0">Location</span>
                    <span className="metadata-value font-semibold text-emerald-700 truncate">{activeSpot.name}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-label w-28 shrink-0">Address</span>
                    <span className="metadata-value text-xs text-[#4A5565] truncate">{activeSpot.address}</span>
                  </div>
                  {comment && (
                    <div className="metadata-row">
                      <span className="metadata-label w-28 shrink-0">Your Note</span>
                      <span className="metadata-value italic text-[#8A181A]">"{comment}"</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsSaved(false)}
                  className="mt-4 text-xs font-poppins text-[#6A7282] hover:text-[#8A181A] underline cursor-pointer"
                >
                  Change Date / Time / Spot / Note
                </button>
              </div>
            ) : (
              /* Date Form + Comment Box */
              <form onSubmit={handleConfirm} className="space-y-4">
                {/* Active Venue Banner */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-emerald-950 truncate">{activeSpot.name}</p>
                      <p className="text-[11px] text-emerald-700 truncate">{activeSpot.address}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase shrink-0 ml-2">
                    Selected
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-poppins font-semibold text-[#364153] mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] text-sm focus:outline-none focus:border-[#8A181A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-poppins font-semibold text-[#364153] mb-1 flex items-center justify-between">
                    <span>Preferred Time</span>
                    <Clock className="w-3.5 h-3.5 text-[#8A181A]" />
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] text-sm focus:outline-none focus:border-[#8A181A]"
                  />
                </div>

                {/* Comment Box (YES Branch) */}
                <div>
                  <label className="block text-xs font-poppins font-semibold text-[#364153] mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#8A181A]" />
                    <span>Your Note / Comment for Me (Optional)</span>
                  </label>
                  <textarea
                    ref={commentRef}
                    rows={2}
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Leave a message or thoughts..."
                    className="w-full p-3 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] text-sm focus:outline-none focus:border-[#8A181A] transition-all placeholder:text-[#99A1AF] resize-none font-poppins overflow-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-crimson w-full py-3.5 text-sm flex items-center justify-center gap-2 mt-3 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{isSubmitting ? 'Saving Date...' : 'Confirm Our Coffee Date'}</span>
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
