import { useState, useEffect, useCallback, useRef } from 'react';

const TURNSTILE_SITE_KEY = '0x4AAAAAACytWZA9iejDm7dK';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded) { resolve(); return; }
    loadCallbacks.push(resolve);
    if (scriptLoading) return;
    scriptLoading = true;

    window.onTurnstileLoad = () => {
      scriptLoaded = true;
      loadCallbacks.forEach(cb => cb());
      loadCallbacks.length = 0;
    };

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    script.async = true;
    document.head.appendChild(script);
  });
}

export function useTurnstile() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderWidget = useCallback(async () => {
    if (!containerRef.current) return;
    setLoading(true);
    setError(null);
    setToken(null);

    try {
      await loadTurnstileScript();
      if (!window.turnstile) throw new Error('Turnstile failed to load');

      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (t: string) => { setToken(t); setLoading(false); },
        'error-callback': () => { setError('Verification failed. Please try again.'); setLoading(false); },
        'expired-callback': () => { setToken(null); setError('Verification expired. Please try again.'); },
        theme: 'dark',
        size: 'invisible',
      });
    } catch {
      setError('Could not load verification. Please refresh.');
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    setError(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  return { token, error, loading, reset, containerRef };
}
