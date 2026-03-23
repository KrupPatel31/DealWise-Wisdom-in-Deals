// Updating the resend email payload field name from reply_to to replyTo

export const handler = async (event) => {
    // Extract necessary information from the event
    const { email, ...payload } = event;

    // Prepare the email payload
    const emailPayload = {
        ...payload,
        replyTo: email // Changed field name from reply_to to replyTo
    };

    // Logic to send email
    // ...
};