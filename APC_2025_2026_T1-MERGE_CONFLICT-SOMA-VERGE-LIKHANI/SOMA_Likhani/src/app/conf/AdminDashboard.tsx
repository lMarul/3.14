import React, { useState, useEffect } from 'react';
import type { AppConfig, ResponseData, Slide, QuizQuestion } from './types';
import {
  Lock, Trash2, Save, RefreshCw, Layers, MapPin, MessageSquare, Heart, ArrowLeft, CheckCircle2,
  XCircle, Plus, Edit3, MoveUp, MoveDown, HelpCircle, Sparkles, BarChart3, Clock, Eye, Users, Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminDashboardProps {
  config: AppConfig;
  onSaveConfig: (updatedConfig: AppConfig) => Promise<void>;
  responses: ResponseData[];
  onRefreshResponses: () => Promise<void>;
  onAddResponse: (responseData: Partial<ResponseData>) => Promise<void>;
  onUpdateResponse: (id: string, updatedData: Partial<ResponseData>) => Promise<void>;
  onDeleteResponse: (id: string) => Promise<void>;
  onNavigateToUserView: () => void;
  analyticsSummary?: {
    totalLogs: number;
    uniqueSessions: number;
    totalViewSeconds: number;
    avgSessionDuration: number;
    screenBreakdown: { key: string; count: number; totalSeconds: number; avgSeconds: number }[];
  } | null;
  sessionLogs?: any[];
  onRefreshAnalytics?: () => Promise<void>;
  onClearAnalytics?: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  onSaveConfig,
  responses,
  onRefreshResponses,
  onAddResponse,
  onUpdateResponse,
  onDeleteResponse,
  onNavigateToUserView,
  analyticsSummary,
  sessionLogs,
  onRefreshAnalytics,
  onClearAnalytics,
}) => {
  const [activeTab, setActiveTab] = useState<'RESPONSES' | 'ANALYTICS' | 'QUIZ' | 'SLIDES' | 'CONFIG'>('RESPONSES');
  const [isSaving, setIsSaving] = useState(false);
  const [editableConfig, setEditableConfig] = useState<AppConfig>(config);

  const [isAddingResponse, setIsAddingResponse] = useState(false);
  const [editingResponse, setEditingResponse] = useState<ResponseData | null>(null);

  const [responseForm, setResponseForm] = useState({
    choice: 'YES' as 'YES' | 'NO',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  useEffect(() => {
    setEditableConfig(config);
  }, [config]);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await onSaveConfig(editableConfig);
      toast.success('Configuration saved successfully!', {
        description: 'All changes have been synced to the database.',
      });
    } catch (err) {
      toast.error('Failed to save configuration.', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResponse) {
      await onUpdateResponse(editingResponse.id, {
        choice: responseForm.choice,
        preferredDate: responseForm.preferredDate || undefined,
        preferredTime: responseForm.preferredTime || undefined,
        message: responseForm.message || undefined,
      });
      setEditingResponse(null);
    } else {
      await onAddResponse({
        choice: responseForm.choice,
        preferredDate: responseForm.preferredDate || undefined,
        preferredTime: responseForm.preferredTime || undefined,
        message: responseForm.message || undefined,
      });
      setIsAddingResponse(false);
    }
    setResponseForm({ choice: 'YES', preferredDate: '', preferredTime: '', message: '' });
  };

  const openEditResponse = (resp: ResponseData) => {
    setEditingResponse(resp);
    setResponseForm({
      choice: resp.choice,
      preferredDate: resp.preferredDate || '',
      preferredTime: resp.preferredTime || '',
      message: resp.message || '',
    });
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      title: 'New Confession Slide',
      subtitle: 'Custom Subtitle',
      content: 'Write your heartfelt message here...',
      quote: '"A special line to remember."',
      iconName: 'heart',
    };
    setEditableConfig({
      ...editableConfig,
      slides: [...editableConfig.slides, newSlide],
    });
  };

  const handleUpdateSlide = (index: number, updatedFields: Partial<Slide>) => {
    const updatedSlides = [...editableConfig.slides];
    updatedSlides[index] = { ...updatedSlides[index], ...updatedFields };
    setEditableConfig({ ...editableConfig, slides: updatedSlides });
  };

  const handleDeleteSlide = (index: number) => {
    if (editableConfig.slides.length <= 1) {
      alert('You must have at least 1 slide in the deck.');
      return;
    }
    const updatedSlides = editableConfig.slides.filter((_, idx) => idx !== index);
    setEditableConfig({ ...editableConfig, slides: updatedSlides });
  };

  const handleMoveSlide = (index: number, direction: 'UP' | 'DOWN') => {
    const newIndex = direction === 'UP' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editableConfig.slides.length) return;
    const updatedSlides = [...editableConfig.slides];
    const temp = updatedSlides[index];
    updatedSlides[index] = updatedSlides[newIndex];
    updatedSlides[newIndex] = temp;
    setEditableConfig({ ...editableConfig, slides: updatedSlides });
  };

  // Quiz Editor Functions
  const handleUpdateQuizQuestion = (qIndex: number, updatedFields: Partial<QuizQuestion>) => {
    const updatedQs = [...(editableConfig.quizQuestions || [])];
    updatedQs[qIndex] = { ...updatedQs[qIndex], ...updatedFields };
    setEditableConfig({ ...editableConfig, quizQuestions: updatedQs });
  };

  const handleUpdateQuizOption = (qIndex: number, optIndex: number, newOptionText: string) => {
    const updatedQs = [...(editableConfig.quizQuestions || [])];
    const updatedOpts = [...updatedQs[qIndex].options];
    updatedOpts[optIndex] = newOptionText;
    updatedQs[qIndex] = { ...updatedQs[qIndex], options: updatedOpts };
    setEditableConfig({ ...editableConfig, quizQuestions: updatedQs });
  };

  const handleAddQuizQuestion = () => {
    const newQ: QuizQuestion = {
      id: Date.now(),
      question: "New Verification Question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      correctComment: "Bingo! Correct answer! ✨",
      wrongComment: "It's okay! I'll let you pass anyway 😉",
    };
    setEditableConfig({
      ...editableConfig,
      quizQuestions: [...(editableConfig.quizQuestions || []), newQ],
    });
  };

  const handleDeleteQuizQuestion = (qIndex: number) => {
    const updatedQs = (editableConfig.quizQuestions || []).filter((_, idx) => idx !== qIndex);
    setEditableConfig({ ...editableConfig, quizQuestions: updatedQs });
  };

  const yesCount = responses.filter(r => r.choice === 'YES').length;
  const noCount = responses.filter(r => r.choice === 'NO').length;

  return (
    <div className="min-h-screen w-full bg-[#F7F6F3] text-[#101828] p-4 sm:p-8 flex flex-col items-center justify-start relative z-10 font-poppins">
      {/* Top Navbar */}
      <div className="w-full max-w-5xl flex items-center justify-between py-4 mb-8 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8A181A] flex items-center justify-center shadow-md">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-poppins text-xl sm:text-2xl font-bold text-[#101828]">
              Admin Dashboard
            </h1>
            <p className="text-xs text-[#6A7282]">Manage recipient responses, quiz questions & confession content</p>
          </div>
        </div>

        <button
          onClick={onNavigateToUserView}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F3F4F6] border border-[#D1D5DC] text-[#364153] text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8A181A]" />
          <span>View Confession Experience</span>
        </button>
      </div>

      {/* Main Admin Content Container */}
      <div className="w-full max-w-5xl flex-1 flex flex-col space-y-6">
        {/* Key Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sentimental-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6A7282] font-semibold uppercase tracking-wider">Total Responses</p>
              <p className="text-2xl font-poppins font-bold text-[#101828] mt-1">{responses.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F6F3] text-[#8A181A]">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="sentimental-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6A7282] font-semibold uppercase tracking-wider">Said YES 💖</p>
              <p className="text-2xl font-poppins font-bold text-[#8A181A] mt-1">{yesCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#8A181A]/10 text-[#8A181A]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="sentimental-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6A7282] font-semibold uppercase tracking-wider">Said NO 💔</p>
              <p className="text-2xl font-poppins font-bold text-[#364153] mt-1">{noCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F6F3] text-[#6A7282]">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('RESPONSES')}
              className={activeTab === 'RESPONSES' ? 'pill-active px-5 py-2.5 text-xs cursor-pointer' : 'pill-inactive px-4 py-2.5 text-xs cursor-pointer'}
            >
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Responses ({responses.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={activeTab === 'ANALYTICS' ? 'pill-active px-5 py-2.5 text-xs cursor-pointer' : 'pill-inactive px-4 py-2.5 text-xs cursor-pointer'}
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                View Time Telemetry
              </span>
            </button>
            <button
              onClick={() => setActiveTab('QUIZ')}
              className={activeTab === 'QUIZ' ? 'pill-active px-5 py-2.5 text-xs cursor-pointer' : 'pill-inactive px-4 py-2.5 text-xs cursor-pointer'}
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Quiz Questions ({(editableConfig.quizQuestions || []).length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('SLIDES')}
              className={activeTab === 'SLIDES' ? 'pill-active px-5 py-2.5 text-xs cursor-pointer' : 'pill-inactive px-4 py-2.5 text-xs cursor-pointer'}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Slides Deck ({editableConfig.slides.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('CONFIG')}
              className={activeTab === 'CONFIG' ? 'pill-active px-5 py-2.5 text-xs cursor-pointer' : 'pill-inactive px-4 py-2.5 text-xs cursor-pointer'}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                App Settings
              </span>
            </button>
          </div>

          {activeTab === 'RESPONSES' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingResponse(null);
                  setResponseForm({ choice: 'YES', preferredDate: '', preferredTime: '', message: '' });
                  setIsAddingResponse(true);
                }}
                className="btn-crimson px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Response</span>
              </button>
              <button
                onClick={onRefreshResponses}
                className="p-2 rounded-xl bg-white hover:bg-[#F3F4F6] border border-[#D1D5DC] text-[#4A5565] transition-colors cursor-pointer"
                title="Refresh responses"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'QUIZ' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddQuizQuestion}
                className="btn-crimson px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Quiz Question</span>
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="px-4 py-2 rounded-[10px] bg-white hover:bg-[#F3F4F6] border border-[#D1D5DC] text-[#101828] text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-[#8A181A]" />
                <span>Save Quiz Setup</span>
              </button>
            </div>
          )}

          {activeTab === 'SLIDES' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddSlide}
                className="btn-crimson px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Slide</span>
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="px-4 py-2 rounded-[10px] bg-white hover:bg-[#F3F4F6] border border-[#D1D5DC] text-[#101828] text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-[#8A181A]" />
                <span>Save Slides Deck</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: RESPONSES CRUD */}
        {activeTab === 'RESPONSES' && (
          <div className="space-y-4">
            {(isAddingResponse || editingResponse) && (
              <div className="sentimental-card p-6 border border-[#E5E7EB] animate-fade-in mb-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F3F4F6]">
                  <h3 className="font-poppins font-bold text-lg text-[#101828] flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#8A181A]" />
                    <span>{editingResponse ? 'Edit Response Entry' : 'Create New Response Entry'}</span>
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingResponse(false);
                      setEditingResponse(null);
                    }}
                    className="text-xs text-[#6A7282] hover:text-[#8A181A] underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleResponseSubmit} className="space-y-4 text-xs font-poppins">
                  <div>
                    <label className="block text-[#364153] font-semibold mb-1">Decision Choice</label>
                    <select
                      value={responseForm.choice}
                      onChange={(e) => setResponseForm({ ...responseForm, choice: e.target.value as 'YES' | 'NO' })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                    >
                      <option value="YES">YES - Coffee Date Accepted 💖</option>
                      <option value="NO">NO - Declined / Note Left 💔</option>
                    </select>
                  </div>

                  {responseForm.choice === 'YES' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#364153] font-semibold mb-1">Preferred Date</label>
                        <input
                          type="date"
                          value={responseForm.preferredDate}
                          onChange={(e) => setResponseForm({ ...responseForm, preferredDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#364153] font-semibold mb-1">Preferred Time</label>
                        <input
                          type="time"
                          value={responseForm.preferredTime}
                          onChange={(e) => setResponseForm({ ...responseForm, preferredTime: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[#364153] font-semibold mb-1">Recipient Note / Message</label>
                      <textarea
                        rows={3}
                        value={responseForm.message}
                        onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                        placeholder="Write recipient response message..."
                        className="w-full p-3.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="btn-crimson px-6 py-2.5 text-xs cursor-pointer"
                    >
                      {editingResponse ? 'Update Response' : 'Save Response'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {responses.length === 0 ? (
              <div className="sentimental-card p-12 text-center text-[#6A7282] text-sm">
                <MessageSquare className="w-12 h-12 text-[#8A181A]/30 mx-auto mb-3" />
                <p className="font-semibold text-[#101828]">No responses recorded yet</p>
                <p className="text-xs text-[#6A7282] mt-1">
                  Click "Create Response" above to add a response entry manually, or wait for recipient submission.
                </p>
              </div>
            ) : (
              responses.map((resp) => (
                <div
                  key={resp.id}
                  className="sentimental-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 font-poppins">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-xs tracking-wider flex items-center gap-1.5 ${
                          resp.choice === 'YES'
                            ? 'bg-[#8A181A]/10 text-[#8A181A] border border-[#8A181A]/30'
                            : 'bg-[#F3F4F6] text-[#364153] border border-[#D1D5DC]'
                        }`}
                      >
                        {resp.choice === 'YES' ? '💖 SAID YES' : '💔 SAID NO'}
                      </span>
                      <span className="text-xs text-[#99A1AF] font-mono">
                        {new Date(resp.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {resp.choice === 'YES' && (
                      <div className="p-3 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB] text-xs space-y-1 text-[#364153]">
                        <p>
                          <span className="text-[#8A181A] font-semibold">Preferred Coffee Date:</span>{' '}
                          <span className="font-bold text-[#101828]">{resp.preferredDate || 'Not specified'}</span>
                        </p>
                        <p>
                          <span className="text-[#8A181A] font-semibold">Preferred Time:</span>{' '}
                          <span className="font-bold text-[#101828]">{resp.preferredTime || 'Not specified'}</span>
                        </p>
                      </div>
                    )}

                    {resp.choice === 'NO' && resp.message && (
                      <div className="p-4 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB] text-[#364153] text-xs italic leading-relaxed">
                        "{resp.message}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => openEditResponse(resp)}
                      className="p-2.5 rounded-xl bg-white hover:bg-[#F7F6F3] border border-[#D1D5DC] text-[#364153] transition-colors cursor-pointer"
                      title="Edit response entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteResponse(resp.id)}
                      className="p-2.5 rounded-xl bg-white hover:bg-[#F7F6F3] border border-[#D1D5DC] text-[#8A181A] transition-colors cursor-pointer"
                      title="Delete response entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 1.5: VIEW TIME TELEMETRY & ANALYTICS */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6 font-poppins">
            {/* Key Telemetry Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sentimental-card p-5">
                <p className="text-xs text-[#6A7282] font-semibold uppercase tracking-wider">Total Visitors / Sessions</p>
                <p className="text-2xl font-poppins font-bold text-[#101828] mt-1">{analyticsSummary?.uniqueSessions || 0}</p>
              </div>
              <div className="sentimental-card p-5">
                <p className="text-xs text-[#6A7282] font-semibold uppercase tracking-wider">Total View Time</p>
                <p className="text-2xl font-poppins font-bold text-[#8A181A] mt-1">
                  {Math.floor((analyticsSummary?.totalViewSeconds || 0) / 60)}m {Math.round((analyticsSummary?.totalViewSeconds || 0) % 60)}s
                </p>
              </div>
              <div className="sentimental-card p-5">
                <p className="text-xs text-[#6A7282] font-semibold uppercase tracking-wider">Avg Session Length</p>
                <p className="text-2xl font-poppins font-bold text-[#101828] mt-1">{analyticsSummary?.avgSessionDuration || 0}s</p>
              </div>
              <div className="sentimental-card p-5">
                <p className="text-xs text-[#6A7282] font-semibold uppercase tracking-wider">Total Telemetry Events</p>
                <p className="text-2xl font-poppins font-bold text-[#364153] mt-1">{analyticsSummary?.totalLogs || 0}</p>
              </div>
            </div>

            {/* Screen & Slide View Duration Breakdown */}
            <div className="sentimental-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-poppins font-bold text-lg text-[#101828]">Average View Duration per Page / Slide</h3>
                  <p className="text-xs text-[#6A7282]">Real-time telemetry tracking from Loading Intro to Decision & Response</p>
                </div>
                {onRefreshAnalytics && (
                  <button
                    onClick={onRefreshAnalytics}
                    className="p-2 rounded-xl bg-white hover:bg-[#F3F4F6] border border-[#D1D5DC] text-[#4A5565] transition-colors cursor-pointer"
                    title="Refresh Telemetry"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3 pt-2">
                {(!analyticsSummary || !analyticsSummary.screenBreakdown || analyticsSummary.screenBreakdown.length === 0) ? (
                  <p className="text-xs text-[#6A7282] italic text-center py-6">No telemetry logs recorded yet. Visit the /conf page to generate live view time logs!</p>
                ) : (
                  analyticsSummary.screenBreakdown.map((item: any) => {
                    const maxAvg = Math.max(...analyticsSummary.screenBreakdown.map((s: any) => s.avgSeconds || 1));
                    const percentage = Math.min(100, Math.round(((item.avgSeconds || 0) / maxAvg) * 100));
                    const formatKey = item.key.replace('_', ' ');
                    return (
                      <div key={item.key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#101828] uppercase tracking-wider font-mono">{formatKey}</span>
                          <span className="text-[#8A181A]">{item.avgSeconds}s avg ({item.count} visits &middot; {item.totalSeconds}s total)</span>
                        </div>
                        <div className="w-full bg-[#E5E7EB] rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-[#8A181A] h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Detailed Telemetry Log Table */}
            <div className="sentimental-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-poppins font-bold text-lg text-[#101828]">Visitor Telemetry Entry Log</h3>
                  <p className="text-xs text-[#6A7282]">Recorded entry times and durations stored in Convex DB</p>
                </div>
                {onClearAnalytics && sessionLogs && sessionLogs.length > 0 && (
                  <button
                    onClick={onClearAnalytics}
                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-colors cursor-pointer"
                  >
                    Clear Telemetry Logs
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] text-[#6A7282] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Session ID</th>
                      <th className="py-2.5 px-3">Screen / Slide</th>
                      <th className="py-2.5 px-3">View Duration</th>
                      <th className="py-2.5 px-3">Start Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {(!sessionLogs || sessionLogs.length === 0) ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-[#6A7282] italic">No telemetry logs available yet</td>
                      </tr>
                    ) : (
                      sessionLogs.slice(0, 50).map((log: any) => (
                        <tr key={log._id || log.sessionId + log.startTime} className="hover:bg-[#F9FAFB]">
                          <td className="py-2.5 px-3 font-mono text-[#364153]">{log.sessionId.slice(0, 16)}...</td>
                          <td className="py-2.5 px-3 font-semibold text-[#8A181A]">
                            {log.screen} {log.slideIndex !== undefined ? `(Slide #${log.slideIndex})` : ''}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#101828]">{log.durationSeconds}s</td>
                          <td className="py-2.5 px-3 text-[#6A7282]">{new Date(log.startTime).toLocaleTimeString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUIZ QUESTIONS CRUD */}
        {activeTab === 'QUIZ' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] text-xs text-[#4A5565] space-y-3 font-poppins">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#101828] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8A181A]" />
                  <span>Verification Quiz Header & Questions</span>
                </span>
                <button
                  onClick={handleAddQuizQuestion}
                  className="btn-crimson px-3 py-1.5 text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              <div>
                <label className="block text-[#364153] font-semibold mb-1">Quiz Header Title</label>
                <input
                  type="text"
                  value={editableConfig.quizTitle || 'Are you really Pia?'}
                  onChange={(e) => setEditableConfig({ ...editableConfig, quizTitle: e.target.value })}
                  placeholder="Are you really Pia?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                />
              </div>
            </div>

            {(editableConfig.quizQuestions || []).map((q, qIdx) => (
              <div key={q.id || qIdx} className="sentimental-card p-6 space-y-4 text-xs font-poppins">
                <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#8A181A] text-white flex items-center justify-center font-mono font-bold text-xs">
                      {qIdx + 1}
                    </span>
                    <h4 className="font-poppins font-bold text-base text-[#101828]">
                      Quiz Question #{qIdx + 1}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleDeleteQuizQuestion(qIdx)}
                    className="p-1.5 rounded-lg bg-[#F7F6F3] hover:bg-rose-100 text-[#8A181A] border border-[#D1D5DC] cursor-pointer"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[#364153] font-semibold mb-1">Question Prompt</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleUpdateQuizQuestion(qIdx, { question: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] font-medium"
                  />
                </div>

                {/* 4 Choice Options */}
                <div className="space-y-2.5">
                  <label className="block text-[#364153] font-semibold">Choice Options</label>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correctChoice_${qIdx}`}
                        checked={q.correctIndex === optIdx}
                        onChange={() => handleUpdateQuizQuestion(qIdx, { correctIndex: optIdx })}
                        className="w-4 h-4 accent-[#8A181A] cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="font-mono text-xs text-[#99A1AF] w-16 shrink-0">
                        Option {String.fromCharCode(65 + optIdx)}:
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateQuizOption(qIdx, optIdx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                      />
                    </div>
                  ))}
                  <p className="text-[11px] text-[#99A1AF] italic">Select the radio button next to the option that is the correct answer.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[#364153] font-semibold mb-1">Correct Answer Reaction Comment</label>
                    <input
                      type="text"
                      value={q.correctComment}
                      onChange={(e) => handleUpdateQuizQuestion(qIdx, { correctComment: e.target.value })}
                      placeholder="Bingo! You got it right! 🐋💙"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#364153] font-semibold mb-1">Wrong Answer Reaction Comment</label>
                    <input
                      type="text"
                      value={q.wrongComment}
                      onChange={(e) => handleUpdateQuizQuestion(qIdx, { wrongComment: e.target.value })}
                      placeholder="It's okay! I'll let you pass anyway 😉"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="btn-crimson w-full py-4 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save All Quiz Questions'}</span>
            </button>
          </div>
        )}

        {/* TAB 3: SLIDES CRUD */}
        {activeTab === 'SLIDES' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] text-xs text-[#4A5565] flex items-center justify-between font-poppins">
              <span>Manage your confession deck slides. You can create, edit text, reorder, or delete slides.</span>
              <button
                onClick={handleAddSlide}
                className="btn-crimson px-3 py-1.5 text-xs flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            {editableConfig.slides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="sentimental-card p-6 space-y-4 text-xs font-poppins"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#8A181A] text-white flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </span>
                    <h4 className="font-poppins font-bold text-base text-[#101828]">
                      Slide #{idx + 1}: {slide.title || 'Untitled Slide'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveSlide(idx, 'UP')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-[#F7F6F3] hover:bg-[#E5E7EB] text-[#364153] disabled:opacity-30 border border-[#D1D5DC] cursor-pointer"
                      title="Move slide up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSlide(idx, 'DOWN')}
                      disabled={idx === editableConfig.slides.length - 1}
                      className="p-1.5 rounded-lg bg-[#F7F6F3] hover:bg-[#E5E7EB] text-[#364153] disabled:opacity-30 border border-[#D1D5DC] cursor-pointer"
                      title="Move slide down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(idx)}
                      className="p-1.5 rounded-lg bg-[#F7F6F3] hover:bg-rose-100 text-[#8A181A] border border-[#D1D5DC] cursor-pointer"
                      title="Delete slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#364153] font-semibold mb-1">Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleUpdateSlide(idx, { title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#364153] font-semibold mb-1">Subtitle / Category</label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => handleUpdateSlide(idx, { subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#364153] font-semibold mb-1">Main Message Content</label>
                  <textarea
                    rows={3}
                    value={slide.content}
                    onChange={(e) => handleUpdateSlide(idx, { content: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#364153] font-semibold mb-1">Quote Callout (Optional)</label>
                    <input
                      type="text"
                      value={slide.quote || ''}
                      onChange={(e) => handleUpdateSlide(idx, { quote: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828] italic"
                    />
                  </div>
                  <div>
                    <label className="block text-[#364153] font-semibold mb-1">Header Icon</label>
                    <select
                      value={slide.iconName || 'sparkles'}
                      onChange={(e) => handleUpdateSlide(idx, { iconName: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                    >
                      <option value="heart">Heart ❤️</option>
                      <option value="coffee">Coffee ☕</option>
                      <option value="sparkles">Sparkles ✨</option>
                      <option value="star">Star ⭐</option>
                      <option value="smile">Smile 😊</option>
                      <option value="book">Book 📖</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="btn-crimson w-full py-4 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save All Slide Changes'}</span>
            </button>
          </div>
        )}

        {/* TAB 4: APP SETTINGS CRUD */}
        {activeTab === 'CONFIG' && (
          <div className="sentimental-card p-6 sm:p-8 space-y-6 text-xs font-poppins">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#364153] font-semibold mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={editableConfig.recipientName}
                  onChange={(e) => setEditableConfig({ ...editableConfig, recipientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                />
              </div>
              <div>
                <label className="block text-[#364153] font-semibold mb-1">Sender Name</label>
                <input
                  type="text"
                  value={editableConfig.senderName}
                  onChange={(e) => setEditableConfig({ ...editableConfig, senderName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#364153] font-semibold mb-1">Main Question Text</label>
              <input
                type="text"
                value={editableConfig.questionText}
                onChange={(e) => setEditableConfig({ ...editableConfig, questionText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-[#101828]"
              />
            </div>

            {/* Coffee Location Settings */}
            <div className="p-4 rounded-2xl bg-[#F7F6F3] border border-[#E5E7EB] space-y-3">
              <h4 className="font-bold text-[#101828] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8A181A]" />
                <span>Coffee Shop Coordinates & Address</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6A7282] mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={editableConfig.coffeeLocation.name}
                    onChange={(e) =>
                      setEditableConfig({
                        ...editableConfig,
                        coffeeLocation: { ...editableConfig.coffeeLocation, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1D5DC] text-[#101828]"
                  />
                </div>
                <div>
                  <label className="block text-[#6A7282] mb-1">Address</label>
                  <input
                    type="text"
                    value={editableConfig.coffeeLocation.address}
                    onChange={(e) =>
                      setEditableConfig({
                        ...editableConfig,
                        coffeeLocation: { ...editableConfig.coffeeLocation, address: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1D5DC] text-[#101828]"
                  />
                </div>
                <div>
                  <label className="block text-[#6A7282] mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editableConfig.coffeeLocation.lat}
                    onChange={(e) =>
                      setEditableConfig({
                        ...editableConfig,
                        coffeeLocation: { ...editableConfig.coffeeLocation, lat: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1D5DC] text-[#101828]"
                  />
                </div>
                <div>
                  <label className="block text-[#6A7282] mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editableConfig.coffeeLocation.lng}
                    onChange={(e) =>
                      setEditableConfig({
                        ...editableConfig,
                        coffeeLocation: { ...editableConfig.coffeeLocation, lng: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1D5DC] text-[#101828]"
                  />
                </div>
              </div>
            </div>

            {/* Toggle Evasive Mechanics */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="evasiveToggleAdmin"
                checked={editableConfig.evasiveNoButton}
                onChange={(e) => setEditableConfig({ ...editableConfig, evasiveNoButton: e.target.checked })}
                className="w-4 h-4 accent-[#8A181A] rounded cursor-pointer"
              />
              <label htmlFor="evasiveToggleAdmin" className="text-[#364153] cursor-pointer font-medium">
                Enable Playful Evasive "No" Button (dodges cursor on hover)
              </label>
            </div>

            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="btn-crimson w-full py-4 text-sm flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Settings...' : 'Save All Settings'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
