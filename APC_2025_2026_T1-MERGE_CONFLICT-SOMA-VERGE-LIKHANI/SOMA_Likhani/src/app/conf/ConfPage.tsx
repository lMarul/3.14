import React, { useState, useRef } from 'react';
import type { AppConfig, AppScreen, ResponseData } from './types';
import { defaultConfig } from './defaultConfig';
import { BackgroundEffects } from './BackgroundEffects';
import { QuizViewer } from './QuizViewer';
import { LoadingIntro } from './LoadingIntro';
import { CongratsScreen } from './CongratsScreen';
import { SlideViewer } from './SlideViewer';
import { DecisionSlide } from './DecisionSlide';
import { MapLocation } from './MapLocation';
import { MessageForm } from './MessageForm';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import './conf.css';

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://colorless-dalmatian-736.convex.cloud';
const convex = new ConvexHttpClient(convexUrl);

export const ConfPage: React.FC = () => {
  const [config] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('conf_app_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultConfig;
  });

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('INTRO');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

  // YES Response Submission to Convex Database + localStorage (including optional comment)
  const handleConfirmDate = async (date: string, time: string, message?: string) => {
    const newResp: ResponseData = {
      id: 'resp_' + Date.now(),
      choice: 'YES',
      preferredDate: date,
      preferredTime: time,
      message: message || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      await convex.mutation(api.responses.add, {
        choice: 'YES',
        preferredDate: date,
        preferredTime: time,
        message: message || null,
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
    <div className="conf-container min-h-screen flex flex-col justify-center relative bg-[#8A181A] text-[#101828] font-poppins overflow-x-hidden selection:bg-[#8A181A] selection:text-white">
      {/* Background Layer with Likhani Editorial Banner SVG */}
      <BackgroundEffects isPlayingAudio={isPlayingAudio} onToggleAudio={toggleAudio} />

      {/* CLEAN USER EXPERIENCE — NO HEADER/NAVBAR, NO FOOTER */}
      <div className="min-h-screen w-full flex flex-col justify-center items-center relative z-10 py-6">
        <main className="w-full max-w-4xl mx-auto flex items-center justify-center flex-1 my-auto">
          {currentScreen === 'INTRO' && (
            <LoadingIntro
              recipientName={config.recipientName}
              onStart={() => setCurrentScreen('QUIZ')}
            />
          )}

          {currentScreen === 'QUIZ' && (
            <QuizViewer
              questions={config.quizQuestions || []}
              recipientName={config.recipientName}
              quizTitle={config.quizTitle}
              onCompleteQuiz={() => setCurrentScreen('CONGRATS')}
            />
          )}

          {currentScreen === 'CONGRATS' && (
            <CongratsScreen
              recipientName={config.recipientName}
              onProceed={() => setCurrentScreen('SLIDES')}
            />
          )}

          {currentScreen === 'SLIDES' && (
            <SlideViewer
              slides={config.slides}
              currentIndex={slideIndex}
              onNext={handleNextSlide}
              onPrev={handlePrevSlide}
              onSelectSlide={(index) => setSlideIndex(index)}
              onBackToQuiz={() => setCurrentScreen('QUIZ')}
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
      </div>
    </div>
  );
};

export default ConfPage;
