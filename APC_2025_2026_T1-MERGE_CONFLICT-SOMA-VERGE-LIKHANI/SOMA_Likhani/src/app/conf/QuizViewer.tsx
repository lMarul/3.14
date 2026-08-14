import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import type { QuizQuestion } from './types';
import { HelpCircle, CheckCircle2, XCircle, ChevronRight, Heart, Sparkles } from 'lucide-react';

interface QuizViewerProps {
  questions: QuizQuestion[];
  recipientName: string;
  quizTitle?: string;
  onCompleteQuiz: () => void;
  onQuestionChange?: (index: number) => void;
}

export const QuizViewer: React.FC<QuizViewerProps> = ({
  questions,
  recipientName,
  quizTitle,
  onCompleteQuiz,
  onQuestionChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const titleText = quizTitle || `Are you really ${recipientName}?`;

  const triggerOptionConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.65 },
      colors: ['#10B981', '#34D399', '#8A181A', '#FDE047', '#38BDF8']
    });
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    if (idx === currentQ.correctIndex) {
      triggerOptionConfetti();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      if (onQuestionChange) onQuestionChange(nextIdx);
    } else {
      onCompleteQuiz();
    }
  };

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ.correctIndex;
  
  // Custom reaction comment for the exact selected option if provided, otherwise fallback to correct/wrong comments
  const feedbackComment = selectedOption !== null && currentQ.optionComments && currentQ.optionComments[selectedOption]
    ? currentQ.optionComments[selectedOption]
    : isCorrect
    ? currentQ.correctComment
    : (currentQ.wrongComment || "It's okay! I'll let you pass anyway 😉");

  // Enforce 2x2 grid for all 4-option questions
  const isGridOptions = currentQ.options.length === 4;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-2 flex flex-col items-center justify-center h-full max-h-[92vh] font-poppins overflow-hidden">
      {/* Top Header Identity Title */}
      <div className="text-center mb-3 shrink-0">
        <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-0.5 drop-shadow-md">
          {titleText}
        </h2>
        <p className="font-poppins text-white/70 text-[11px] sm:text-xs max-w-sm mx-auto">
          Please complete this verification so that no one other than <span className="font-semibold text-white">{recipientName}</span> will be able to view this note
        </p>
      </div>

      {/* Main Sentimental Quiz Card */}
      <div key={currentIndex} className="w-full sentimental-card p-4 sm:p-6 relative overflow-hidden shadow-2xl border border-[#E5E7EB] animate-slide-fade">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-3 border-b border-[#F3F4F6] pb-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-lg bg-[#8A181A]/10 text-[#8A181A]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="font-poppins font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#8A181A]">
              Verification Question 0{currentIndex + 1} of 0{questions.length}
            </span>
          </div>

          <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#99A1AF]">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}% Verified
          </span>
        </div>

        {/* Question Text */}
        <h3 className="font-poppins text-base sm:text-lg font-bold text-[#101828] mb-3 leading-snug">
          {currentQ.question}
        </h3>

        {/* Options List: 2x2 Grid format for questions */}
        {isGridOptions ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-3">
            {currentQ.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isEmojiOnly = optionText.trim().length <= 6;
              const isThisCorrect = idx === currentQ.correctIndex;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`relative p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[65px] sm:min-h-[75px] text-center ${
                    isSelected
                      ? isThisCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md scale-[1.02]'
                        : 'bg-rose-50 border-rose-500 text-rose-900 shadow-md scale-[1.02]'
                      : 'bg-[#F7F6F3] border-[#D1D5DC] text-[#364153] hover:border-[#8A181A] hover:bg-white hover:scale-[1.01]'
                  }`}
                >
                  {isEmojiOnly ? (
                    <span className="text-3xl sm:text-4xl select-none leading-none">{optionText}</span>
                  ) : (
                    <span className="text-xs sm:text-[13px] font-medium font-poppins leading-snug px-1 text-center">{optionText}</span>
                  )}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 animate-bounce-short">
                      {isThisCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 fill-rose-100" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2 mb-3">
            {currentQ.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isThisCorrect = idx === currentQ.correctIndex;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-2 font-poppins text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isThisCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md font-semibold'
                        : 'bg-rose-50 border-rose-500 text-rose-900 shadow-md font-semibold'
                      : 'bg-[#F7F6F3] border-[#D1D5DC] text-[#364153] hover:border-[#8A181A] hover:bg-white'
                  }`}
                >
                  <span>{optionText}</span>
                  {isSelected && (
                    <div>
                      {isThisCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 fill-rose-100" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Comment Box when Option is Selected */}
        {isAnswered && (
          <div className={`mb-3 p-2.5 sm:p-3 rounded-xl border animate-fade-in text-[11px] sm:text-xs font-poppins flex items-start gap-2.5 ${
            isCorrect ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50/80 border-rose-200'
          }`}>
            <div className={`p-1.5 rounded-lg shadow-sm shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {isCorrect ? (
                <span className="text-sm">🎉</span>
              ) : (
                <span className="text-sm">❌</span>
              )}
            </div>
            <div>
              <p className={`font-bold text-xs mb-0.5 ${isCorrect ? 'text-emerald-950' : 'text-rose-950'}`}>
                {isCorrect ? 'Bingo!' : 'Oops, close!'}
              </p>
              <p className={`leading-snug ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                {feedbackComment}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Action Control: Only enabled when user selects the CORRECT answer */}
        <div className="flex items-center justify-between pt-1">
          {isAnswered && !isCorrect && (
            <span className="text-[11px] font-semibold text-rose-300 animate-pulse flex items-center gap-1">
              <span>⚠️</span>
              <span>Please pick the correct answer to proceed</span>
            </span>
          )}

          <button
            onClick={handleNext}
            disabled={!isCorrect}
            className={`btn-crimson flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm cursor-pointer shadow-md ml-auto ${
              !isCorrect ? 'opacity-40 cursor-not-allowed grayscale pointer-events-none' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <span>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Verify & Unlock Note'}
            </span>
            {currentIndex < questions.length - 1 ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-rose-200" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
