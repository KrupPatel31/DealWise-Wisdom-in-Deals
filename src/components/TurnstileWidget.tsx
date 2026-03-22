import React from 'react';

const TurnstileWidget = () => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    return (
        <div>
            {/* Your widget implementation goes here, using siteKey */}
            <div>Turnstile Site Key: {siteKey}</div>
        </div>
    );
};

export default TurnstileWidget;