import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { runAuthWithRetry } from '@/utils/authRetry';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  online: boolean;
  authReady: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type QueuedRequest = {
  type: 'signIn' | 'signUp';
  payload: any;
  resolve: (v: any) => void;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const queueRef = useRef<QueuedRequest[]>([]);
  const expiryTimerRef = useRef<number | null>(null);

  // ---- Diagnostics: verify env + auth service reachability on mount ----
  useEffect(() => {
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      console.error('[auth:diagnostics] Missing Supabase environment variables', { hasUrl: !!url, hasKey: !!key });
      toast.error('Authentication service is not configured. Please contact support.');
    } else {
      console.info('[auth:diagnostics] Supabase env loaded');
      // Lightweight reachability check
      supabase.auth
        .getSession()
        .then(() => console.info('[auth:diagnostics] Auth service reachable at', new Date().toISOString()))
        .catch((e) => {
          console.error('[auth:diagnostics] Auth service unreachable:', e);
          toast.error('Cannot reach authentication service. Some features may be unavailable.');
        });
    }
  }, []);

  // ---- Schedule auto-logout when token expires ----
  const scheduleExpiry = (s: Session | null) => {
    if (expiryTimerRef.current) {
      window.clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
    if (!s?.expires_at) return;
    const expiresAtMs = s.expires_at * 1000;
    const now = Date.now();
    const delay = Math.max(0, expiresAtMs - now);
    if (delay === 0) return;
    expiryTimerRef.current = window.setTimeout(async () => {
      console.warn('[auth] session expired, signing out');
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('[auth] signOut on expiry failed:', e);
      }
      toast.error('Your session has expired. Please sign in again.');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/sign-in')) {
        window.location.href = '/sign-in';
      }
    }, delay);
  };

  // ---- Auth state wiring ----
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.info(`[auth] ${event} @ ${new Date().toISOString()}`);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        scheduleExpiry(newSession);
        if (event === 'TOKEN_REFRESHED') {
          console.info('[auth] token refreshed');
        }
      },
    );

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      scheduleExpiry(existing);
      setLoading(false);
      setAuthReady(true);
    }).catch((e) => {
      console.error('[auth] getSession failed:', e);
      setLoading(false);
      setAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
      if (expiryTimerRef.current) window.clearTimeout(expiryTimerRef.current);
    };
  }, []);

  // ---- Online/offline + queue draining ----
  useEffect(() => {
    const drain = async () => {
      if (queueRef.current.length === 0) return;
      console.info(`[auth] draining ${queueRef.current.length} queued auth request(s)`);
      const queue = queueRef.current.splice(0, queueRef.current.length);
      for (const item of queue) {
        try {
          const result =
            item.type === 'signIn'
              ? await doSignIn(item.payload.email, item.payload.password)
              : await doSignUp(item.payload.email, item.payload.password, item.payload.fullName);
          item.resolve(result);
        } catch (err) {
          item.resolve({ error: err });
        }
      }
    };
    const goOnline = () => {
      setOnline(true);
      toast.success('Back online.');
      drain();
    };
    const goOffline = () => {
      setOnline(false);
      toast.error('You are offline. Auth requests will be queued.');
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doSignUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const result = await runAuthWithRetry(
      () =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: fullName },
          },
        }),
      { label: 'signUp' },
    );
    return { error: result.error };
  };

  const doSignIn = async (email: string, password: string) => {
    const result = await runAuthWithRetry(
      () => supabase.auth.signInWithPassword({ email, password }),
      { label: 'signIn' },
    );
    return { error: result.error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.warn('[auth] offline, queueing signUp');
      return new Promise<{ error: any }>((resolve) => {
        queueRef.current.push({ type: 'signUp', payload: { email, password, fullName }, resolve });
        toast.message('You are offline. We saved your request and will retry when you reconnect.');
      });
    }
    try {
      return await doSignUp(email, password, fullName);
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.warn('[auth] offline, queueing signIn');
      return new Promise<{ error: any }>((resolve) => {
        queueRef.current.push({ type: 'signIn', payload: { email, password }, resolve });
        toast.message('You are offline. We saved your request and will retry when you reconnect.');
      });
    }
    try {
      return await doSignIn(email, password);
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('[auth] signOut failed:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      online,
      authReady,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
