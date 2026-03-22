declare global {
    interface Window {
        turnstile: any;
        onloadTurnstileCallback: () => void;
    }
}

export {};