import React, { useState } from 'react';
import { HeartHandshake, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface MessageFormProps {
  recipientName: string;
  onSubmitMessage: (message: string) => Promise<void>;
  onBackToSlides: () => void;
}

export const MessageForm: React.FC<MessageFormProps> = ({
  recipientName,
  onSubmitMessage,
  onBackToSlides,
}) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write a message before submitting.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmitMessage(message.trim());
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center min-h-[75vh]">
      <div className="w-full sentimental-card p-6 sm:p-10 relative overflow-hidden shadow-xl border border-[#E5E7EB]">
        {/* Header Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#8A181A] flex items-center justify-center mb-6 shadow-md">
          <HeartHandshake className="w-7 h-7 text-white" />
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className="text-center py-6 animate-fade-in">
            <CheckCircle2 className="w-14 h-14 text-[#8A181A] mx-auto mb-4" />
            <h3 className="font-poppins text-2xl sm:text-3xl font-bold text-[#101828] mb-2">
              Thank You For Your Honesty ❤️
            </h3>
            <p className="font-poppins text-[#4A5565] text-sm sm:text-base mb-6 leading-relaxed">
              I truly appreciate you taking the time to read my message and sharing your thoughts. Your reply has been delivered.
            </p>
            <div className="p-4 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB] italic text-xs text-[#364153] mb-6 text-left font-poppins">
              "{message}"
            </div>
            <button
              onClick={onBackToSlides}
              className="font-poppins text-xs text-[#6A7282] hover:text-[#8A181A] underline transition-colors cursor-pointer"
            >
              Return to start
            </button>
          </div>
        ) : (
          /* Form Screen */
          <div>
            <div className="text-center mb-6">
              <span className="font-poppins font-bold text-[10px] tracking-[1.6px] uppercase text-[#8A181A] bg-[#8A181A]/10 px-3 py-1 rounded-full mb-2 inline-block">
                Graceful Pathway
              </span>
              <h3 className="font-poppins text-2xl sm:text-3xl font-bold text-[#101828] mb-2">
                Thank You for Being Honest
              </h3>
              <p className="font-poppins text-[#4A5565] text-xs sm:text-sm">
                Dear {recipientName}, I completely understand and respect your feelings. If there's anything you'd like to leave as a note or explanation, feel free to write it below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-poppins font-semibold text-[#364153] mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#8A181A]" />
                  <span>Your Message / Note for Me</span>
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Type your message here..."
                  className="w-full p-4 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] text-sm focus:outline-none focus:border-[#8A181A] transition-colors placeholder:text-[#99A1AF] resize-none font-poppins"
                />
                {error && (
                  <p className="text-xs text-[#8A181A] mt-1.5 font-semibold flex items-center gap-1 font-poppins">
                    <span>⚠️</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-crimson w-full py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {!isSubmitted && (
        <button
          onClick={onBackToSlides}
          className="mt-6 font-poppins text-xs text-[#6A7282] hover:text-[#8A181A] underline transition-colors cursor-pointer"
        >
          ← Return to confession slides
        </button>
      )}
    </div>
  );
};
