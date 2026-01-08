import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderConfirmationRequest {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      orderNumber,
      customerEmail,
      customerName,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod,
      shippingAddress,
    }: OrderConfirmationRequest = await req.json();

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 500; color: #111827;">${item.name}</div>
            <div style="font-size: 14px; color: #6b7280;">Qty: ${item.quantity}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500; color: #111827;">
            ₹${(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
      `
      )
      .join("");

    const paymentMethodLabel = {
      "credit-card": "Credit Card",
      "debit-card": "Debit Card",
      "upi": "UPI",
      "net-banking": "Net Banking",
      "cash-on-delivery": "Cash on Delivery",
    }[paymentMethod] || paymentMethod;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">DEALWISE</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Order Confirmation</p>
            </div>

            <!-- Main Content -->
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <!-- Success Icon -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                  <span style="font-size: 30px;">✓</span>
                </div>
                <h2 style="color: #111827; margin: 20px 0 10px 0; font-size: 24px;">Thank You, ${customerName}!</h2>
                <p style="color: #6b7280; margin: 0;">Your order has been confirmed and is being processed.</p>
              </div>

              <!-- Order Number -->
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Order Number</p>
                <p style="color: #111827; margin: 0; font-size: 20px; font-weight: 700;">#${orderNumber}</p>
              </div>

              <!-- Order Items -->
              <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                ${itemsHtml}
              </table>

              <!-- Totals -->
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #6b7280;">Subtotal</span>
                  <span style="color: #111827;">₹${subtotal.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #6b7280;">Shipping</span>
                  <span style="color: #111827;">${shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div style="border-top: 2px solid #e5e7eb; padding-top: 10px; margin-top: 10px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #111827; font-weight: 700; font-size: 18px;">Total</span>
                    <span style="color: #2563eb; font-weight: 700; font-size: 18px;">₹${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <!-- Shipping Details -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div>
                  <h4 style="color: #111827; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Shipping Address</h4>
                  <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
                    ${shippingAddress.fullName}<br>
                    ${shippingAddress.address}<br>
                    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
                    Phone: ${shippingAddress.phone}
                  </p>
                </div>
                <div>
                  <h4 style="color: #111827; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Payment Method</h4>
                  <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    ${paymentMethodLabel}
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                  Questions about your order? Contact our support team.
                </p>
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                  © ${new Date().getFullYear()} DealWise. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "DealWise <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Order Confirmed! #${orderNumber}`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending order confirmation:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
