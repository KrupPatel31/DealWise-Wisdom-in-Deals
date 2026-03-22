import { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    theme?: "light" | "dark" | "auto";
    className?: string;
}

declare global {
    interface Window {
        turnstile: {
            render: (container: string | HTMLElement, options: object) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
        onloadTurnstileCallback: () => void;
    }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAACuggoF1VDKzpd2e";

export function TurnstileWidget({
    onSuccess,
    onError,
    onExpire,
    theme = "dark",
    className = "",
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const renderedRef = useRef(false);

    useEffect(() => {
        const renderWidget = () => {
            if (!containerRef.current || renderedRef.current) return;
            if (typeof window.turnstile === "undefined") return;

            renderedRef.current = true;
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: SITE_KEY,
                theme,
                callback: onSuccess,
                "error-callback": onError,
                "expired-callback": onExpire,
            });
        };

        // If script already loaded
        if (typeof window.turnstile !== "undefined") {
            renderWidget();
            return;
        }

        // Inject Turnstile script once
        if (!document.getElementById("cf-turnstile-script")) {
            window.onloadTurnstileCallback = renderWidget;
            const script = document.createElement("script");
            script.id = "cf-turnstile-script";
            script.src =
                "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        } else {
            // Script injected by another instance, poll until ready
            const interval = setInterval(() => {
                if (typeof window.turnstile !== "undefined") {
                    clearInterval(interval);
                    renderWidget();
                }
            }, 100);
            return () => clearInterval(interval);
        }

        return () => {
            if (widgetIdRef.current && typeof window.turnstile !== "undefined") {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (_) { }
            }
            renderedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={containerRef}
            className={`flex justify-center my-2 ${className}`}
        />
    );
}

export function resetTurnstile(widgetId: string | null) {
    if (widgetId && typeof window.turnstile !== "undefined") {
        try {
            window.turnstile.reset(widgetId);
        } catch (_) { }
    }
}