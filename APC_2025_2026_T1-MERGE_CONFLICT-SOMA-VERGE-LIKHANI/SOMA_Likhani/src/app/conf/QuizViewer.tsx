import React, { useState } from 'react';
import type { QuizQuestion } from './types';
import { HelpCircle, CheckCircle2, ChevronRight, Heart, Sparkles } from 'lucide-react';

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

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
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

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`relative p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[65px] sm:min-h-[75px] text-center ${
                    isSelected
                      ? isCorrect
                        ? 'bg-[#8A181A]/10 border-[#8A181A] text-[#8A181A] shadow-md scale-[1.01]'
                        : 'bg-rose-50 border-rose-300 text-rose-900 shadow-md scale-[1.01]'
                      : 'bg-[#F7F6F3] border-[#D1D5DC] text-[#364153] hover:border-[#8A181A] hover:bg-white hover:scale-[1.01]'
                  }`}
                >
                  {isEmojiOnly ? (
                    <span className="text-3xl sm:text-4xl select-none leading-none">{optionText}</span>
                  ) : (
                    <span className="text-xs sm:text-[13px] font-medium font-poppins leading-snug px-1 text-center">{optionText}</span>
                  )}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isCorrect ? 'text-[#8A181A]' : 'text-rose-500'}`} />
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

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border font-poppins text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isCorrect
                        ? 'bg-[#8A181A]/10 border-[#8A181A] text-[#8A181A] shadow font-semibold'
                        : 'bg-rose-50 border-rose-300 text-rose-900 shadow font-semibold'
                      : 'bg-[#F7F6F3] border-[#D1D5DC] text-[#364153] hover:border-[#8A181A] hover:bg-white'
                  }`}
                >
                  <span>{optionText}</span>
                  {isSelected && (
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCorrect ? 'text-[#8A181A]' : 'text-rose-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Comment Box when Option is Selected */}
        {isAnswered && (
          <div className="mb-3 p-2.5 sm:p-3 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB] animate-fade-in text-[11px] sm:text-xs font-poppins flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-white shadow-sm shrink-0">
              {isCorrect ? (
                <span className="text-sm">🎉</span>
              ) : (
                <span className="text-sm">😉</span>
              )}
            </div>
            <div>
              <p className="font-bold text-[#101828] text-xs mb-0.5">
                {isCorrect ? 'Bingo!' : 'Close enough!'}
              </p>
              <p className="text-[#4A5565] leading-snug">
                {feedbackComment}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Action Control (No Skip Button) */}
        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`btn-crimson flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm cursor-pointer shadow-md ${
              !isAnswered ? 'opacity-50 cursor-not-allowed' : ''
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
