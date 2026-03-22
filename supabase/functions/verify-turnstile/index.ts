const {Turnstile} = require('turnstile');

const verifyTurnstile = async (token) => {
    const secretKey = Deno.env.get("TURNSTILE_SECRET_KEY");
    const turnstile = new Turnstile({ secret: secretKey });

    // Logic to verify the token...
    const response = await turnstile.verify(token);
    return response;
};

module.exports = { verifyTurnstile };