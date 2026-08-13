import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import type { AppConfig, AppScreen, ResponseData } from './types';
import { defaultConfig } from './data/defaultConfig';
import { BackgroundEffects } from './components/BackgroundEffects';
import { SlideViewer } from './components/SlideViewer';
import { DecisionSlide } from './components/DecisionSlide';
import { MapLocation } from './components/MapLocation';
import { MessageForm } from './components/MessageForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Lock } from 'lucide-react';

export const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [activeView, setActiveView] = useState<'USER' | 'ADMIN'>(
    window.location.pathname === '/admin' || window.location.hash === '#admin' ? 'ADMIN' : 'USER'
  );
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('SLIDES');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [localResponses, setLocalResponses] = useState<ResponseData[]>([]);
  const [latestResponse, setLatestResponse] = useState<ResponseData | null>(null);

  // Convex Real-Time Hooks
  const convexResponses = useQuery(api.responses.list);
  const addConvexResponse = useMutation(api.responses.add);
  const removeConvexResponse = useMutation(api.responses.remove);
  const updateConvexResponse = useMutation(api.responses.update);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Listen to URL changes for /admin routing
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setActiveView('ADMIN');
      } else {
        setActiveView('USER');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Fetch Config & Local Responses
  useEffect(() => {
    fetchConfig();
    fetchResponses();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setConfig(json.data);
        }
      }
    } catch (err) {
      console.log('Using default local config');
    }
  };

  const fetchResponses = async () => {
    try {
      const res = await fetch('/api/responses');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setLocalResponses(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch local responses');
    }
  };

  const handleSaveConfig = async (updatedConfig: AppConfig) => {
    setConfig(updatedConfig);
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });
    } catch (err) {
      console.error('Failed to save config remotely');
    }
  };

  // Merge Convex and Express API responses
  const mergedResponses: ResponseData[] = React.useMemo(() => {
    const list: ResponseData[] = [...localResponses];
    if (convexResponses && Array.isArray(convexResponses)) {
      convexResponses.forEach((cItem: any) => {
        const exists = list.some(l => l.createdAt === cItem.createdAt || l.id === cItem._id);
        if (!exists) {
          list.push({
            id: cItem._id || 'convex_' + cItem._creationTime,
            choice: cItem.choice as 'YES' | 'NO',
            preferredDate: cItem.preferredDate || undefined,
            preferredTime: cItem.preferredTime || undefined,
            message: cItem.message || undefined,
            createdAt: cItem.createdAt || new Date(cItem._creationTime).toISOString(),
          });
        }
      });
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [localResponses, convexResponses]);

  // Audio Synthesizer Controls
  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current?.currentTime || 0, 0.5);
      }
      setTimeout(() => {
        oscillatorRef.current?.stop();
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
      }, 500);
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(174.61, ctx.currentTime);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioCtxRef.current = ctx;
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;

        setIsPlayingAudio(true);
      } catch (e) {
        console.error('Audio initialization error:', e);
      }
    }
  };

  // Slide Navigation
  const handleNextSlide = () => {
    if (slideIndex < config.slides.length - 1) {
      setSlideIndex(prev => prev + 1);
    } else {
      setCurrentScreen('QUESTION');
    }
  };

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setSlideIndex(0);
    setCurrentScreen('SLIDES');
  };

  const handleSelectYes = () => {
    setCurrentScreen('YES_MAP');
  };

  const handleSelectNo = () => {
    setCurrentScreen('NO_FORM');
  };

  // YES Response Submission to Convex & API
  const handleConfirmDate = async (date: string, time: string) => {
    try {
      try {
        await addConvexResponse({
          choice: 'YES',
          preferredDate: date,
          preferredTime: time,
        });
      } catch (e) {
        console.log('Convex submission note:', e);
      }

      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choice: 'YES',
          preferredDate: date,
          preferredTime: time,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLatestResponse(data.data);
        fetchResponses();
      }
    } catch (err) {
      console.error('Error saving YES response:', err);
    }
  };

  // NO Response Submission to Convex & API
  const handleSubmitNoMessage = async (message: string) => {
    try {
      try {
        await addConvexResponse({
          choice: 'NO',
          message: message,
        });
      } catch (e) {
        console.log('Convex submission note:', e);
      }

      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choice: 'NO',
          message: message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLatestResponse(data.data);
        fetchResponses();
      }
    } catch (err) {
      console.error('Error saving NO response:', err);
    }
  };

  // CRUD Response Operations
  const handleAddResponse = async (responseData: Partial<ResponseData>) => {
    try {
      try {
        await addConvexResponse({
          choice: responseData.choice || 'YES',
          preferredDate: responseData.preferredDate || null,
          preferredTime: responseData.preferredTime || null,
          message: responseData.message || null,
        });
      } catch (e) {
        console.log('Convex create note:', e);
      }

      await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData),
      });
      fetchResponses();
    } catch (err) {
      console.error('Failed to create response:', err);
    }
  };

  const handleUpdateResponse = async (id: string, updatedData: Partial<ResponseData>) => {
    try {
      try {
        await updateConvexResponse({
          id: id as any,
          choice: updatedData.choice,
          preferredDate: updatedData.preferredDate,
          preferredTime: updatedData.preferredTime,
          message: updatedData.message,
        });
      } catch (e) {
        console.log('Convex update note:', e);
      }

      await fetch(`/api/responses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      fetchResponses();
    } catch (err) {
      console.error('Failed to update response:', err);
    }
  };

  const handleDeleteResponse = async (id: string) => {
    try {
      try {
        await removeConvexResponse({ id: id as any });
      } catch (e) {
        console.log('Convex remove note:', e);
      }

      await fetch(`/api/responses/${id}`, { method: 'DELETE' });
      fetchResponses();
    } catch (err) {
      console.error('Failed to delete response');
    }
  };

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setActiveView('ADMIN');
  };

  const navigateToUser = () => {
    window.location.hash = '';
    setActiveView('USER');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative bg-[#F7F6F3] text-[#101828] font-poppins overflow-x-hidden selection:bg-[#8A181A] selection:text-white">
      {/* Background Layer */}
      <BackgroundEffects isPlayingAudio={isPlayingAudio} onToggleAudio={toggleAudio} />

      {activeView === 'ADMIN' ? (
        /* DEDICATED ADMIN SIDE */
        <AdminDashboard
          config={config}
          onSaveConfig={handleSaveConfig}
          responses={mergedResponses}
          onRefreshResponses={fetchResponses}
          onAddResponse={handleAddResponse}
          onUpdateResponse={handleUpdateResponse}
          onDeleteResponse={handleDeleteResponse}
          onNavigateToUserView={navigateToUser}
        />
      ) : (
        /* DEDICATED USER SIDE (CONTENT FOCUSED) */
        <div className="min-h-screen w-full flex flex-col justify-center items-center relative z-10 py-8 px-4">
          <main className="w-full max-w-4xl flex items-center justify-center">
            {currentScreen === 'SLIDES' && (
              <SlideViewer
                slides={config.slides}
                currentIndex={slideIndex}
                onNext={handleNextSlide}
                onPrev={handlePrevSlide}
                onSelectSlide={(index) => setSlideIndex(index)}
              />
            )}

            {currentScreen === 'QUESTION' && (
              <DecisionSlide
                questionText={config.questionText}
                recipientName={config.recipientName}
                evasiveEnabled={config.evasiveNoButton}
                onSelectYes={handleSelectYes}
                onSelectNo={handleSelectNo}
                onBackToSlides={() => {
                  setSlideIndex(config.slides.length - 1);
                  setCurrentScreen('SLIDES');
                }}
              />
            )}

            {currentScreen === 'YES_MAP' && (
              <MapLocation
                location={config.coffeeLocation}
                recipientName={config.recipientName}
                senderName={config.senderName}
                onConfirmDate={handleConfirmDate}
                submittedData={latestResponse}
              />
            )}

            {currentScreen === 'NO_FORM' && (
              <MessageForm
                recipientName={config.recipientName}
                onSubmitMessage={handleSubmitNoMessage}
                onBackToSlides={handleReset}
              />
            )}
          </main>

          {/* Discreet Admin Link */}
          <button
            onClick={navigateToAdmin}
            className="fixed bottom-5 left-5 z-40 p-2.5 rounded-full bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#6A7282] hover:text-[#8A181A] shadow-md transition-all opacity-60 hover:opacity-100"
            title="Creator Admin Side (#admin)"
            aria-label="Admin Side"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
