import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CoffeeLocation, ResponseData } from './types';
import { MapPin, Calendar, Clock, Navigation, CheckCircle2, Heart, ExternalLink, MessageSquare } from 'lucide-react';

interface MapLocationProps {
  location: CoffeeLocation;
  recipientName: string;
  senderName: string;
  onConfirmDate: (date: string, time: string, message?: string) => Promise<void>;
  submittedData?: ResponseData | null;
}

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
  const [comment, setComment] = useState<string>(submittedData?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(!!submittedData);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [location.lat, location.lng],
        zoom: 15,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const customIcon = L.divIcon({
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

      const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <strong style="color: #8A181A; font-size: 14px;">${location.name}</strong><br/>
          <span style="font-size: 12px; color: #4A5565;">${location.address}</span><br/>
          <span style="font-size: 12px; color: #8A181A; font-weight: 600; margin-top: 4px; display: inline-block;">See you here! ☕❤️</span>
        </div>
      `);

      mapInstanceRef.current = map;

      // Fix size calculation after container mounting
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    } catch (e) {
      console.error('Leaflet initialization note:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.lat, location.lng, location.name, location.address]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmDate(selectedDate, selectedTime, comment.trim());
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
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center justify-center min-h-[80vh] font-poppins">
      {/* Celebration Header */}
      <div className="text-center mb-6">
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">
          It's a Coffee Date!
        </h2>
        <p className="font-poppins text-white/80 text-sm sm:text-base max-w-lg mx-auto">
          Here is our proposed location. Choose your preferred date, time & leave a message below to seal our plans!
        </p>
      </div>

      {/* Grid Layout: Map Card + Date Selector */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container */}
        <div className="lg:col-span-6 sentimental-card p-4 flex flex-col h-[380px] sm:h-[440px]">
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
          <div className="flex-1 w-full rounded-xl overflow-hidden relative border border-[#E5E7EB] shadow-inner bg-[#F7F6F3]">
            <div ref={mapContainerRef} className="w-full h-full min-h-[280px] z-10" />
          </div>

          <div className="mt-3 px-2 text-xs text-[#6A7282] flex items-center gap-1.5 font-poppins">
            <Navigation className="w-3.5 h-3.5 text-[#8A181A] shrink-0" />
            <span className="truncate">{location.address}</span>
          </div>
        </div>

        {/* Date Selector & Comment Form / Invitation Ticket */}
        <div className="lg:col-span-6 sentimental-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#101828]">
              <Calendar className="w-5 h-5 text-[#8A181A]" />
              <h3 className="font-poppins text-xl font-bold">Plan Details</h3>
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
                  Change Date / Time / Note
                </button>
              </div>
            ) : (
              /* Date Form + Comment Box */
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
