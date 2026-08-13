import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { CoffeeLocation, ResponseData } from '../types';
import { MapPin, Calendar, Clock, Navigation, CheckCircle2, Heart, ExternalLink } from 'lucide-react';

interface MapLocationProps {
  location: CoffeeLocation;
  recipientName: string;
  senderName: string;
  onConfirmDate: (date: string, time: string) => Promise<void>;
  submittedData?: ResponseData | null;
}

const createHeartMarker = () => {
  return L.divIcon({
    className: 'custom-heart-pin',
    html: `
      <div style="
        background: #8A181A;
        width: 44px;
        height: 44px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(138, 24, 26, 0.4);
        border: 2px solid #ffffff;
        cursor: pointer;
      ">
        <span style="transform: rotate(45deg); font-size: 20px;">☕</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });
};

export const MapLocation: React.FC<MapLocationProps> = ({
  location,
  recipientName,
  senderName,
  onConfirmDate,
  submittedData,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(submittedData?.preferredDate || defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>(submittedData?.preferredTime || '14:30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(!!submittedData);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmDate(selectedDate, selectedTime);
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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col items-center justify-center min-h-[80vh]">
      {/* Celebration Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8A181A]/10 border border-[#8A181A]/20 text-[#8A181A] font-poppins font-bold text-xs mb-3">
          <Heart className="w-4 h-4 fill-[#8A181A]" />
          <span>You Said YES! 💖</span>
        </div>
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#101828] mb-2">
          It's a Coffee Date! ☕✨
        </h2>
        <p className="font-poppins text-[#4A5565] text-sm sm:text-base max-w-lg mx-auto">
          Here is our proposed location. Choose your preferred date & time below to seal our plans!
        </p>
      </div>

      {/* Grid Layout: Map Card + Date Selector */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container */}
        <div className="lg:col-span-7 sentimental-card p-4 flex flex-col h-[380px] sm:h-[420px]">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2 text-[#101828] font-poppins font-semibold text-sm">
              <MapPin className="w-4 h-4 text-[#8A181A]" />
              <span className="truncate">{location.name}</span>
            </div>
            {location.googleMapsUrl && (
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#8A181A] hover:underline transition-colors font-poppins font-medium"
              >
                <span>Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Leaflet Map Embed */}
          <div className="flex-1 w-full rounded-xl overflow-hidden relative border border-[#E5E7EB] shadow-inner">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.lat, location.lng]} icon={createHeartMarker()}>
                <Popup>
                  <div className="text-center p-1">
                    <p className="font-bold text-[#8A181A] text-sm">{location.name}</p>
                    <p className="text-xs text-[#4A5565]">{location.address}</p>
                    <p className="text-xs text-[#8A181A] font-semibold mt-1">See you here! ☕❤️</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="mt-3 px-2 text-xs text-[#6A7282] flex items-center gap-1.5 font-poppins">
            <Navigation className="w-3.5 h-3.5 text-[#8A181A] shrink-0" />
            <span className="truncate">{location.address}</span>
          </div>
        </div>

        {/* Date Selector / Invitation Ticket */}
        <div className="lg:col-span-5 sentimental-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#101828]">
              <Calendar className="w-5 h-5 text-[#8A181A]" />
              <h3 className="font-poppins text-xl font-bold">Pick a Time</h3>
            </div>

            {isSaved ? (
              /* Invitation Ticket View */
              <div className="p-5 rounded-2xl bg-[#F7F6F3] border border-[#E5E7EB] text-center animate-fade-in my-2">
                <CheckCircle2 className="w-10 h-10 text-[#8A181A] mx-auto mb-2" />
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
                    <span className="metadata-value font-semibold truncate">{location.name}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsSaved(false)}
                  className="mt-4 text-xs font-poppins text-[#6A7282] hover:text-[#8A181A] underline cursor-pointer"
                >
                  Change Date / Time
                </button>
              </div>
            ) : (
              /* Date Form */
              <form onSubmit={handleConfirm} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-crimson w-full py-3.5 text-sm flex items-center justify-center gap-2 mt-3"
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
