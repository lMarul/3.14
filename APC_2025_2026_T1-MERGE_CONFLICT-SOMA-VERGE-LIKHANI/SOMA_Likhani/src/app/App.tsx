import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ConfPage from "./conf/ConfPage";
import ConfAdminPage from "./conf/ConfAdminPage";

import { CustomThemeProvider } from "./components/providers/ThemeContext";
import { TrapTransitionProvider } from "./context/TrapTransitionContext";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import { clearAuthStorage, setAuthedStorage, setGuestStorage } from "./lib/authStorage";
import { ensureAppUser } from "./lib/appUser";
import GlobalScreenshotProtection from "./components/common/GlobalScreenshotProtection";
import { AnnouncementBanner } from "./components/common/AnnouncementBanner";

function AppContent() {
  // Suppress VideoJS error console logs in production
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('VIDEOJS:') || 
        message.includes('MEDIA_ERR_SRC_NOT_SUPPORTED') ||
        message.includes('Video cannot be played')
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setGuestStorage();
      return () => {
        isMounted = false;
      };
    }

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!isMounted) {
        return;
      }

      if (user) {
        setAuthedStorage(user);
        try {
          await ensureAppUser(user);
        } catch {
          // Keep app usable even if app_users upsert is currently blocked.
        }
      } else {
        clearAuthStorage();
        setGuestStorage();
      }
    };

    syncSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user) {
        setAuthedStorage(user);
      } else {
        clearAuthStorage();
        setGuestStorage();
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <CustomThemeProvider>
      <GlobalScreenshotProtection />
      <AnnouncementBanner />
      <Routes>
        {/* Main App & Trap Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/conf" element={<ConfPage />} />
        <Route path="/conf/admin" element={<ConfAdminPage />} />
        <Route path="/conf-admin" element={<ConfAdminPage />} />
        
        {/* Fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Toast Notification System */}
      <Toaster 
        position="bottom-right"
        expand={false}
        gap={8}
        visibleToasts={5}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 16px',
            minWidth: '280px',
            maxWidth: '360px',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '14px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          },
          classNames: {
            toast: 'group toast group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-white group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200 ease-out data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:duration-150',
            title: 'group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:text-sm',
            description: 'group-[.toast]:text-gray-400 group-[.toast]:text-xs',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
            icon: 'group-data-[type=error]:text-red-500 group-data-[type=success]:text-green-500 group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-blue-500',
          },
        }}
        // Offset from edges (bottom-right)
        offset={24}
      />
    </CustomThemeProvider>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <TrapTransitionProvider>
        <ScrollToTop />
        <AppContent />
      </TrapTransitionProvider>
    </Router>
  );
}
