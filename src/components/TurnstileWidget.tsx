import React, { useRef, useEffect } from 'react';

const TurnstileWidget = () => {
    const ref = useRef(null);

    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = `https://your-turnstile-script-url?render=explicit`;
            script.async = true;
            script.referrerPolicy = 'no-referrer';
            script.onload = () => {
                if (window.renderWidget) {
                    window.renderWidget(ref.current);
                }
            };
            script.onerror = () => {
                console.error('Turnstile script failed to load.');
            };
            document.body.appendChild(script);
        };

        loadScript();
    }, []);

    return <div ref={ref}></div>;
};

export default TurnstileWidget;