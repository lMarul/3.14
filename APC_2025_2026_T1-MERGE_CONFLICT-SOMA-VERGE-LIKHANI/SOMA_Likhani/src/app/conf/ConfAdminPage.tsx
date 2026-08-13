import React, { useState, useEffect } from 'react';
import type { AppConfig, ResponseData } from './types';
import { defaultConfig } from './defaultConfig';
import { AdminDashboard } from './AdminDashboard';
import { getLocalTelemetryLogs, computeAnalyticsSummary, clearLocalTelemetryLogs } from './telemetry';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Lock } from 'lucide-react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import './conf.css';

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://colorless-dalmatian-736.convex.cloud';
const convex = new ConvexHttpClient(convexUrl);

export const ConfAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('conf_app_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultConfig;
  });

  const [responses, setResponses] = useState<ResponseData[]>(() => {
    const saved = localStorage.getItem('conf_app_responses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);

  // Fetch live config from Convex DB
  const handleRefreshConfig = async () => {
    try {
      const remote = await convex.query(api.config.get);
      if (remote && Array.isArray(remote.slides) && remote.slides.length > 0) {
        const loaded: AppConfig = {
          recipientName: remote.recipientName,
          senderName: remote.senderName,
          questionText: remote.questionText,
          quizTitle: remote.quizTitle || undefined,
          quizQuestions: remote.quizQuestions,
          coffeeLocation: remote.coffeeLocation,
          slides: remote.slides,
          evasiveNoButton: remote.evasiveNoButton,
          adminPasscode: remote.adminPasscode || '1234',
        };
        setConfig(loaded);
        localStorage.setItem('conf_app_config', JSON.stringify(loaded));
      }
    } catch (e) {
      console.error('Convex config fetch error:', e);
    }
  };

  // Fetch live analytics from Convex DB with local fallback
  const handleRefreshAnalytics = async () => {
    try {
      const summary = await convex.query(api.analytics.getAnalyticsSummary);
      const logs = await convex.query(api.analytics.listSessionLogs);
      if (summary && summary.totalLogs > 0) {
        setAnalyticsSummary(summary);
        setSessionLogs(logs || []);
        return;
      }
    } catch (e) {
      console.error('Convex analytics fetch note:', e);
    }

    // Fall back to local telemetry
    const localLogs = getLocalTelemetryLogs();
    const localSummary = computeAnalyticsSummary(localLogs);
    setAnalyticsSummary(localSummary);
    setSessionLogs(localLogs);
  };

  const handleClearAnalytics = async () => {
    try {
      await convex.mutation(api.analytics.clearAnalytics);
    } catch (e) {}
    clearLocalTelemetryLogs();
    await handleRefreshAnalytics();
  };

  // Fetch live responses from Convex DB
  const handleRefreshResponses = async () => {
    try {
      const convexList = await convex.query(api.responses.list);
      if (convexList && Array.isArray(convexList)) {
        const formatted: ResponseData[] = convexList.map((item: any) => ({
          id: item._id,
          choice: item.choice as 'YES' | 'NO',
          preferredDate: item.preferredDate || undefined,
          preferredTime: item.preferredTime || undefined,
          message: item.message || undefined,
          createdAt: item.createdAt || new Date(item._creationTime).toISOString(),
        }));
        setResponses(formatted);
        localStorage.setItem('conf_app_responses', JSON.stringify(formatted));
      }
    } catch (e) {
      console.error('Convex DB fetch note:', e);
    }

    const saved = localStorage.getItem('conf_app_responses');
    if (saved) {
      try { setResponses(JSON.parse(saved)); } catch (e) {}
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleRefreshResponses();
      handleRefreshConfig();
      handleRefreshAnalytics();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === config.adminPasscode || passcode === '1234') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect passcode. Default passcode is 1234.');
    }
  };

  const handleSaveConfig = async (updatedConfig: AppConfig) => {
    setConfig(updatedConfig);
    localStorage.setItem('conf_app_config', JSON.stringify(updatedConfig));
    try {
      await convex.mutation(api.config.save, {
        recipientName: updatedConfig.recipientName,
        senderName: updatedConfig.senderName,
        questionText: updatedConfig.questionText,
        quizTitle: updatedConfig.quizTitle,
        quizQuestions: updatedConfig.quizQuestions,
        coffeeLocation: updatedConfig.coffeeLocation,
        slides: updatedConfig.slides,
        evasiveNoButton: updatedConfig.evasiveNoButton,
        adminPasscode: updatedConfig.adminPasscode,
      });
      await handleRefreshConfig();
    } catch (e) {
      console.error('Convex save config error:', e);
    }
  };

  const saveResponses = (newResponses: ResponseData[]) => {
    setResponses(newResponses);
    localStorage.setItem('conf_app_responses', JSON.stringify(newResponses));
  };

  const handleAddResponse = async (responseData: Partial<ResponseData>) => {
    try {
      await convex.mutation(api.responses.add, {
        choice: responseData.choice || 'YES',
        preferredDate: responseData.preferredDate,
        preferredTime: responseData.preferredTime,
        message: responseData.message,
      });
      await handleRefreshResponses();
    } catch (e) {
      console.error('Convex add error:', e);
      const newResp: ResponseData = {
        id: 'resp_' + Date.now(),
        choice: responseData.choice || 'YES',
        preferredDate: responseData.preferredDate,
        preferredTime: responseData.preferredTime,
        message: responseData.message,
        createdAt: new Date().toISOString(),
      };
      saveResponses([newResp, ...responses]);
    }
  };

  const handleUpdateResponse = async (id: string, updatedData: Partial<ResponseData>) => {
    try {
      await convex.mutation(api.responses.update, {
        id: id as any,
        choice: updatedData.choice,
        preferredDate: updatedData.preferredDate,
        preferredTime: updatedData.preferredTime,
        message: updatedData.message,
      });
      await handleRefreshResponses();
    } catch (e) {
      console.error('Convex update error:', e);
      const updated = responses.map(r => r.id === id ? { ...r, ...updatedData } : r);
      saveResponses(updated);
    }
  };

  const handleDeleteResponse = async (id: string) => {
    try {
      await convex.mutation(api.responses.remove, { id: id as any });
      await handleRefreshResponses();
    } catch (e) {
      console.error('Convex delete error:', e);
      const updated = responses.filter(r => r.id !== id);
      saveResponses(updated);
    }
  };

  return (
    <div className="conf-container min-h-screen bg-[#F7F6F3] text-[#101828] font-poppins selection:bg-[#8A181A] selection:text-white">
      {!isAuthenticated ? (
        /* Protected Passcode Gate for Conf Admin */
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#8A181A] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-white" />
            </div>

            <div>
              <h2 className="font-poppins text-2xl font-bold text-[#101828]">Conf Admin Dashboard</h2>
              <p className="text-xs text-[#6A7282] mt-1">View confession responses & manage date settings</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin Passcode"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F6F3] border border-[#D1D5DC] text-center font-mono text-lg text-[#101828] focus:outline-none focus:border-[#8A181A]"
                  autoFocus
                />
                <p className="text-[11px] text-[#99A1AF] mt-1.5">Default passcode is <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded font-mono text-[#8A181A]">1234</code></p>
              </div>

              {error && <p className="text-xs text-[#8A181A] font-semibold">{error}</p>}

              <button
                type="submit"
                className="btn-crimson w-full py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock Conf Admin</span>
              </button>
            </form>

            <div className="pt-4 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
              <button
                onClick={() => navigate('/conf')}
                className="text-[#6A7282] hover:text-[#8A181A] underline cursor-pointer"
              >
                ← Back to Conf App
              </button>
              <button
                onClick={() => navigate('/')}
                className="text-[#6A7282] hover:text-[#8A181A] underline cursor-pointer"
              >
                Back to Likhani
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <AdminDashboard
          config={config}
          onSaveConfig={handleSaveConfig}
          responses={responses}
          onRefreshResponses={handleRefreshResponses}
          onAddResponse={handleAddResponse}
          onUpdateResponse={handleUpdateResponse}
          onDeleteResponse={handleDeleteResponse}
          onNavigateToUserView={() => navigate('/conf')}
          analyticsSummary={analyticsSummary}
          sessionLogs={sessionLogs}
          onRefreshAnalytics={handleRefreshAnalytics}
          onClearAnalytics={handleClearAnalytics}
        />
      )}
    </div>
  );
};

export default ConfAdminPage;
