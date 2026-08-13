import React, { useState } from 'react';
import type { QuizQuestion } from './types';
import { HelpCircle, CheckCircle2, ChevronRight, Heart, Sparkles } from 'lucide-react';

interface QuizViewerProps {
  questions: QuizQuestion[];
  recipientName: string;
  quizTitle?: string;
  onCompleteQuiz: () => void;
}

export const QuizViewer: React.FC<QuizViewerProps> = ({
  questions,
  recipientName,
  quizTitle,
  onCompleteQuiz,
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
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      onCompleteQuiz();
    }
  };

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ.correctIndex;
  const feedbackComment = isCorrect ? currentQ.correctComment : currentQ.wrongComment;

  // Determine if options are short/emoji-only to display as a 2x2 grid
  const isGridOptions = currentQ.options.length === 4 && currentQ.options.every(opt => opt.trim().length <= 6);

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center min-h-[75vh] font-poppins">
      {/* Top Header Identity Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-poppins font-bold text-xs mb-3 shadow-md">
          <Sparkles className="w-4 h-4 text-rose-300" />
          <span>Quick Verification Quiz</span>
        </div>
        <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-white mb-1 drop-shadow-md">
          {titleText}
        </h2>
        <p className="font-poppins text-white/70 text-xs sm:text-sm">
          Answer a quick question to unlock your personal note 💕
        </p>
      </div>

      {/* Main Sentimental Quiz Card */}
      <div className="w-full sentimental-card p-6 sm:p-10 relative overflow-hidden shadow-2xl border border-[#E5E7EB]">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#F3F4F6] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#8A181A]/10 text-[#8A181A]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="font-poppins font-bold text-xs uppercase tracking-wider text-[#8A181A]">
              Question 0{currentIndex + 1} of 0{questions.length}
            </span>
          </div>

          <span className="text-xs font-mono font-semibold text-[#99A1AF]">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}% Verified
          </span>
        </div>

        {/* Question Text */}
        <h3 className="font-poppins text-xl sm:text-2xl font-bold text-[#101828] mb-6 leading-tight">
          {currentQ.question}
        </h3>

        {/* Options List: 2x2 Grid for emoji/short options, standard list otherwise */}
        {isGridOptions ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentQ.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[110px] ${
                    isSelected
                      ? isCorrect
                        ? 'bg-[#8A181A]/10 border-[#8A181A] text-[#8A181A] shadow-lg scale-[1.02]'
                        : 'bg-rose-50 border-rose-300 text-rose-900 shadow-lg scale-[1.02]'
                      : 'bg-[#F7F6F3] border-[#D1D5DC] text-[#364153] hover:border-[#8A181A] hover:bg-white hover:scale-[1.02]'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl select-none leading-none">{optionText}</span>
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5">
                      <CheckCircle2 className={`w-5 h-5 ${isCorrect ? 'text-[#8A181A]' : 'text-rose-500'}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {currentQ.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl border font-poppins text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isCorrect
                        ? 'bg-[#8A181A]/10 border-[#8A181A] text-[#8A181A] shadow-md font-semibold'
                        : 'bg-rose-50 border-rose-300 text-rose-900 shadow-md font-semibold'
                      : 'bg-[#F7F6F3] border-[#D1D5DC] text-[#364153] hover:border-[#8A181A] hover:bg-white'
                  }`}
                >
                  <span>{optionText}</span>
                  {isSelected && (
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${isCorrect ? 'text-[#8A181A]' : 'text-rose-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Comment Box when Option is Selected */}
        {isAnswered && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F7F6F3] border border-[#E5E7EB] animate-fade-in text-xs font-poppins flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white shadow-sm shrink-0">
              {isCorrect ? (
                <span className="text-base">🎉</span>
              ) : (
                <span className="text-base">😉</span>
              )}
            </div>
            <div>
              <p className="font-bold text-[#101828] text-sm mb-0.5">
                {isCorrect ? 'Bingo!' : 'Close enough!'}
              </p>
              <p className="text-[#4A5565] leading-relaxed">
                {feedbackComment}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Action Control (No Skip Button) */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`btn-crimson flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 text-sm cursor-pointer shadow-lg ${
              !isAnswered ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Open Confession Note 💕'}
            </span>
            {currentIndex < questions.length - 1 ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <Heart className="w-4 h-4 fill-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
