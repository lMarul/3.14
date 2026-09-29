import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { AppConfig, AppScreen, ResponseData } from './types';
import { defaultConfig } from './defaultConfig';
import { BackgroundEffects } from './BackgroundEffects';
import { QuizViewer } from './QuizViewer';
import { LoadingIntro } from './LoadingIntro';
import { CongratsScreen } from './CongratsScreen';
import { SlideViewer } from './SlideViewer';
import { DecisionSlide } from './DecisionSlide';
import { MapLocation } from './MapLocation';
import {
  saveLocalTelemetryLog,
  getVisitorId,
  getSessionId,
  getDeviceInfo,
  getCachedLocation,
  getPassiveLocation,
} from './telemetry';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import './conf.css';

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://colorless-dalmatian-736.convex.cloud';
const convex = new ConvexHttpClient(convexUrl);

export const ConfPage: React.FC = () => {
  // --- Live Convex config via useQuery (real-time subscription) ---
  const remoteConfig = useQuery(api.config.get);

  // Derive the active config: prefer live DB config, fall back to defaultConfig
  const config: AppConfig = useMemo(() => {
    if (remoteConfig && Array.isArray(remoteConfig.slides) && remoteConfig.slides.length > 0) {
      return {
        recipientName: remoteConfig.recipientName,
        senderName: remoteConfig.senderName,
        questionText: remoteConfig.questionText,
        quizTitle: remoteConfig.quizTitle || undefined,
        quizQuestions: remoteConfig.quizQuestions,
        coffeeLocation: remoteConfig.coffeeLocation,
        slides: remoteConfig.slides,
        evasiveNoButton: remoteConfig.evasiveNoButton,
        adminPasscode: remoteConfig.adminPasscode || '1234',
      };
    }
    // Fallback: use cached localStorage config or static defaultConfig
    const saved = localStorage.getItem('conf_app_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.slides)) {
          // Merge with current code defaults for slide definitions if updated
          return {
            ...defaultConfig,
            ...parsed,
            slides: defaultConfig.slides,
          };
        }
      } catch (e) {}
    }
    return defaultConfig;
  }, [remoteConfig]);

  // Sync config to localStorage cache whenever it changes from DB
  useEffect(() => {
    if (remoteConfig && Array.isArray(remoteConfig.slides) && remoteConfig.slides.length > 0) {
      localStorage.setItem('conf_app_config', JSON.stringify(config));
    }
  }, [remoteConfig, config]);

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('INTRO');
  const [slideIndex, setSlideIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Persistent visitor ID & active session ID
  const [visitorId] = useState<string>(() => getVisitorId());
  const [sessionId] = useState<string>(() => getSessionId());

  // Passive, non-intrusive IP location lookup on initial mount (silent failure & cached)
  useEffect(() => {
    getPassiveLocation().catch(() => {});
  }, []);

  const screenStartTimeRef = useRef<number>(Date.now());

  const getScreenLabel = (screen: AppScreen, sIndex: number, qIndex: number): string => {
    switch (screen) {
      case 'INTRO':
        return 'INTRO';
      case 'QUIZ':
        return `QUIZ (Question ${qIndex + 1})`;
      case 'CONGRATS':
        return 'CONGRATS';
      case 'SLIDES':
        return `SLIDE ${sIndex + 1}`;
      case 'QUESTION':
        return 'QUESTION';
      case 'YES_MAP':
        return 'YES_MAP';
      case 'NO_FORM':
        return 'NO_FORM';
      default:
        return screen;
    }
  };

  const prevScreenRef = useRef<{ screen: AppScreen; slideIndex: number; quizIndex: number; label: string }>({
    screen: 'INTRO',
    slideIndex: 0,
    quizIndex: 0,
    label: 'INTRO',
  });

  const buildTelemetryPayload = (
    screenLabel: string,
    slideIdx?: number,
    durationSec: number = 0,
    startIso: string = '',
    endIso: string = ''
  ) => {
    const device = getDeviceInfo();
    const geo = getCachedLocation();

    return {
      sessionId,
      visitorId,
      screen: screenLabel,
      slideIndex: slideIdx,
      durationSeconds: Math.round(durationSec * 10) / 10,
      startTime: startIso,
      endTime: endIso,
      deviceType: device.deviceType,
      os: device.os,
      browser: device.browser,
      screenResolution: device.screenResolution,
      viewport: device.viewport,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      ip: geo.ip,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  };

  // Telemetry: Log view duration whenever user transitions screen, slide, or quiz question
  useEffect(() => {
    const prev = prevScreenRef.current;
    const now = Date.now();
    const durationSeconds = (now - screenStartTimeRef.current) / 1000;
    const startTime = new Date(screenStartTimeRef.current).toISOString();
    const endTime = new Date(now).toISOString();

    // Log telemetry for the previous screen/slide/question
    if (durationSeconds >= 0.2) {
      const payload = buildTelemetryPayload(
        prev.label,
        prev.screen === 'SLIDES' ? prev.slideIndex + 1 : undefined,
        durationSeconds,
        startTime,
        endTime
      );

      // Always save locally immediately
      saveLocalTelemetryLog(payload);

      // Save to Convex DB
      convex.mutation(api.analytics.logViewTime, payload).catch((e) => console.log('Telemetry DB log note:', e));
    }

    // Reset start time for current screen/slide/question
    screenStartTimeRef.current = now;
    const currentLabel = getScreenLabel(currentScreen, slideIndex, quizIndex);
    prevScreenRef.current = { screen: currentScreen, slideIndex, quizIndex, label: currentLabel };
  }, [currentScreen, slideIndex, quizIndex, sessionId, visitorId]);

  // Log final view time on page unload
  useEffect(() => {
    const handleUnload = () => {
      const prev = prevScreenRef.current;
      const now = Date.now();
      const durationSeconds = (now - screenStartTimeRef.current) / 1000;
      if (durationSeconds >= 0.2) {
        const payload = buildTelemetryPayload(
          prev.label,
          prev.screen === 'SLIDES' ? prev.slideIndex + 1 : undefined,
          durationSeconds,
          new Date(screenStartTimeRef.current).toISOString(),
          new Date(now).toISOString()
        );

        saveLocalTelemetryLog(payload);
        convex.mutation(api.analytics.logViewTime, payload).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionId, visitorId]);

  const [responses, setResponses] = useState<ResponseData[]>(() => {
    const saved = localStorage.getItem('conf_app_responses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [latestResponse, setLatestResponse] = useState<ResponseData | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Save responses to localStorage
  const saveResponses = (newResponses: ResponseData[]) => {
    setResponses(newResponses);
    localStorage.setItem('conf_app_responses', JSON.stringify(newResponses));
  };

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

  // YES Response Submission to Convex Database + localStorage (including optional comment, venue & outfit color)
  const handleConfirmDate = async (
    date: string,
    time: string,
    message?: string,
    selectedLocation?: CoffeeLocation,
    colorToWear?: string
  ) => {
    const venueName = selectedLocation?.name || config.coffeeLocation?.name;
    const newResp: ResponseData = {
      id: 'resp_' + Date.now(),
      choice: 'YES',
      preferredDate: date,
      preferredTime: time,
      message: message || undefined,
      selectedLocation: selectedLocation || config.coffeeLocation,
      selectedLocationName: venueName,
      colorToWear: colorToWear || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      const metaTags = `[Location: ${venueName}]${colorToWear ? ` [Color to wear: ${colorToWear}]` : ''}`;
      await convex.mutation(api.responses.add, {
        choice: 'YES',
        preferredDate: date,
        preferredTime: time,
        message: message ? `${metaTags} ${message}` : metaTags,
      });
      console.log('Successfully saved YES response to Convex DB!');
    } catch (e) {
      console.error('Convex DB submission note:', e);
    }

    saveResponses([newResp, ...responses]);
    setLatestResponse(newResp);
  };

  // NO Response Submission to Convex Database + localStorage
  const handleSubmitNoMessage = async (message: string) => {
    const newResp: ResponseData = {
      id: 'resp_' + Date.now(),
      choice: 'NO',
      message: message,
      createdAt: new Date().toISOString(),
    };

    try {
      await convex.mutation(api.responses.add, {
        choice: 'NO',
        message: message,
      });
      console.log('Successfully saved NO response to Convex DB!');
    } catch (e) {
      console.error('Convex DB submission note:', e);
    }

    saveResponses([newResp, ...responses]);
    setLatestResponse(newResp);
  };

  return (
    <div className="conf-container h-screen max-h-screen w-full flex flex-col justify-center relative bg-[#8A181A] text-[#101828] font-poppins overflow-hidden selection:bg-[#8A181A] selection:text-white animate-slow-fade-in">
      {/* Background Layer with Likhani Editorial Banner SVG */}
      <BackgroundEffects isPlayingAudio={isPlayingAudio} onToggleAudio={toggleAudio} />

      {/* CLEAN USER EXPERIENCE — NO SCROLLBAR, FITS VIEWPORT PERFECTLY */}
      <div className="h-full w-full flex flex-col justify-center items-center relative z-10 p-2 sm:p-4 overflow-hidden">
        <main className={`w-full ${currentScreen === 'YES_MAP' ? 'max-w-6xl' : 'max-w-5xl'} mx-auto flex items-center justify-center flex-1 my-auto overflow-hidden transition-all duration-300`}>
          {currentScreen === 'INTRO' && (
            <LoadingIntro
              recipientName={config.recipientName}
              onStart={() => {
                setQuizIndex(0);
                setCurrentScreen('QUIZ');
              }}
            />
          )}

          {currentScreen === 'QUIZ' && (
            <QuizViewer
              questions={config.quizQuestions || []}
              recipientName={config.recipientName}
              quizTitle={config.quizTitle}
              onQuestionChange={(idx) => setQuizIndex(idx)}
              onCompleteQuiz={() => setCurrentScreen('CONGRATS')}
            />
          )}

          {currentScreen === 'CONGRATS' && (
            <CongratsScreen
              recipientName={config.recipientName}
              onProceed={() => {
                setSlideIndex(0);
                setCurrentScreen('SLIDES');
              }}
            />
          )}

          {currentScreen === 'SLIDES' && (
            <SlideViewer
              slides={config.slides}
              currentIndex={slideIndex}
              onNext={handleNextSlide}
              onPrev={handlePrevSlide}
              onSelectSlide={(index) => setSlideIndex(index)}
              onBackToQuiz={() => {
                setQuizIndex(0);
                setCurrentScreen('QUIZ');
              }}
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
              coffeeSpots={config.coffeeSpots}
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
      </div>
    </div>
  );
};

export default ConfPage;
