import React, { useEffect } from 'react';

const TurnstileWidget = ({ onSuccess, onError, onExpire, theme, className }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
    script.async = true;
    document.body.appendChild(script);

    window.onloadTurnstileCallback = () => {
      window.turnstile.render('#turnstile-widget', {
        sitekey: process.env.VITE_TURNSTILE_SITE_KEY,
        callback: onSuccess,
        'error-callback': onError,
        'expired-callback': onExpire,
        theme: theme,
        className: className
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onSuccess, onError, onExpire, theme, className]);

  return <div id="turnstile-widget" className={className}></div>;
};

export default TurnstileWidget;
