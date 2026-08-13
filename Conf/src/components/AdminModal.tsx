import React, { useState, useEffect } from 'react';
import type { AppConfig, ResponseData } from '../types';
import { X, Lock, KeyRound, Trash2, Save, RefreshCw, Layers, MapPin, MessageSquare } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSaveConfig: (updatedConfig: AppConfig) => Promise<void>;
  responses: ResponseData[];
  onRefreshResponses: () => Promise<void>;
  onDeleteResponse: (id: string) => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  responses,
  onRefreshResponses,
  onDeleteResponse,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'RESPONSES' | 'CONFIG'>('RESPONSES');
  const [isSaving, setIsSaving] = useState(false);

  // Editable config state
  const [editableConfig, setEditableConfig] = useState<AppConfig>(config);

  useEffect(() => {
    setEditableConfig(config);
  }, [config]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === config.adminPasscode || passcode === '1234') {
      setIsAuthenticated(true);
      setError('');
      onRefreshResponses();
    } else {
      setError('Incorrect passcode. Default is 1234.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveConfig(editableConfig);
      alert('Configuration updated successfully!');
    } catch (err) {
      alert('Failed to save config.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-burgundy-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-rose-50">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-950 flex items-center justify-center border border-rose-400/40">
              <Lock className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-rose-100">Creator Admin Panel</h3>
              <p className="text-[11px] text-rose-300/70">Manage responses & app text</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-950 text-rose-300 hover:text-rose-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Passcode Gate */
          <form onSubmit={handleLogin} className="py-8 space-y-4 max-w-xs mx-auto text-center">
            <KeyRound className="w-10 h-10 text-rose-400 mx-auto" />
            <h4 className="font-serif text-xl font-bold">Enter Admin Passcode</h4>
            <p className="text-xs text-rose-300/80">Default passcode is <code className="bg-burgundy-950 px-1.5 py-0.5 rounded text-rose-400">1234</code></p>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="w-full px-4 py-3 rounded-xl bg-burgundy-950 border border-rose-500/40 text-center font-mono text-lg text-rose-100 focus:outline-none focus:border-rose-400"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md text-sm"
            >
              Unlock Admin
            </button>
          </form>
        ) : (
          /* Admin Dashboard Content */
          <div className="flex-1 flex flex-col overflow-hidden pt-4">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('RESPONSES')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'RESPONSES'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-burgundy-950 text-rose-300/80 hover:text-rose-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Submissions ({responses.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('CONFIG')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'CONFIG'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-burgundy-950 text-rose-300/80 hover:text-rose-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>App Settings</span>
                </button>
              </div>

              {activeTab === 'RESPONSES' && (
                <button
                  onClick={onRefreshResponses}
                  className="p-2 rounded-xl bg-burgundy-950 hover:bg-rose-950 text-rose-300 hover:text-rose-100 transition-colors text-xs flex items-center gap-1"
                  title="Refresh responses"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}
            </div>

            {/* Tab 1: Submissions */}
            {activeTab === 'RESPONSES' && (
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {responses.length === 0 ? (
                  <div className="text-center py-12 text-rose-300/60 text-sm">
                    No submissions received yet.
                  </div>
                ) : (
                  responses.map((resp) => (
                    <div
                      key={resp.id}
                      className="p-4 rounded-2xl bg-burgundy-950 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wide ${
                              resp.choice === 'YES'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                                : 'bg-red-950 text-red-300 border border-red-800'
                            }`}
                          >
                            {resp.choice === 'YES' ? '💖 SAID YES' : '💔 SAID NO'}
                          </span>
                          <span className="text-rose-400/60 font-mono text-[10px]">
                            {new Date(resp.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {resp.choice === 'YES' && (
                          <p className="text-rose-200 font-medium">
                            Date: <span className="text-rose-400 font-bold">{resp.preferredDate}</span> at{' '}
                            <span className="text-rose-400 font-bold">{resp.preferredTime}</span>
                          </p>
                        )}

                        {resp.choice === 'NO' && resp.message && (
                          <div className="p-2.5 rounded-xl bg-burgundy-900 text-rose-100 italic border border-rose-500/20 mt-1">
                            "{resp.message}"
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onDeleteResponse(resp.id)}
                        className="self-end sm:self-center p-2 rounded-xl bg-burgundy-900 hover:bg-rose-950 text-rose-400 hover:text-rose-200 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Config Editor */}
            {activeTab === 'CONFIG' && (
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-rose-300 font-semibold mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={editableConfig.recipientName}
                      onChange={(e) => setEditableConfig({ ...editableConfig, recipientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-burgundy-950 border border-rose-500/40 text-rose-100"
                    />
                  </div>
                  <div>
                    <label className="block text-rose-300 font-semibold mb-1">Sender Name</label>
                    <input
                      type="text"
                      value={editableConfig.senderName}
                      onChange={(e) => setEditableConfig({ ...editableConfig, senderName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-burgundy-950 border border-rose-500/40 text-rose-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-rose-300 font-semibold mb-1">Main Question Text</label>
                  <input
                    type="text"
                    value={editableConfig.questionText}
                    onChange={(e) => setEditableConfig({ ...editableConfig, questionText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-burgundy-950 border border-rose-500/40 text-rose-100"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-burgundy-950 border border-rose-500/30 space-y-3">
                  <h4 className="font-bold text-rose-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Coffee Shop Details</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-rose-300/80 mb-1">Shop Name</label>
                      <input
                        type="text"
                        value={editableConfig.coffeeLocation.name}
                        onChange={(e) =>
                          setEditableConfig({
                            ...editableConfig,
                            coffeeLocation: { ...editableConfig.coffeeLocation, name: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-burgundy-900 border border-rose-500/30 text-rose-100"
                      />
                    </div>
                    <div>
                      <label className="block text-rose-300/80 mb-1">Address</label>
                      <input
                        type="text"
                        value={editableConfig.coffeeLocation.address}
                        onChange={(e) =>
                          setEditableConfig({
                            ...editableConfig,
                            coffeeLocation: { ...editableConfig.coffeeLocation, address: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-burgundy-900 border border-rose-500/30 text-rose-100"
                      />
                    </div>
                    <div>
                      <label className="block text-rose-300/80 mb-1">Latitude</label>
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
                        className="w-full px-2.5 py-1.5 rounded-lg bg-burgundy-900 border border-rose-500/30 text-rose-100"
                      />
                    </div>
                    <div>
                      <label className="block text-rose-300/80 mb-1">Longitude</label>
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
                        className="w-full px-2.5 py-1.5 rounded-lg bg-burgundy-900 border border-rose-500/30 text-rose-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="evasiveToggle"
                    checked={editableConfig.evasiveNoButton}
                    onChange={(e) => setEditableConfig({ ...editableConfig, evasiveNoButton: e.target.checked })}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                  <label htmlFor="evasiveToggle" className="text-rose-200 cursor-pointer font-medium">
                    Enable Evasive "No" Button (moves away from cursor on hover)
                  </label>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
