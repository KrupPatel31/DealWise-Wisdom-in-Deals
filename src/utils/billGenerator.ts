interface OrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  store: string;
  discount: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

interface OrderData {
  order_number: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shipping_address: ShippingAddress;
  payment_method: string;
  status: string;
  notes?: string;
  created_at: string;
  discount?: number;
}

const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'cod':
      return 'Cash on Delivery';
    case 'upi':
      return 'UPI Payment';
    case 'card':
      return 'Credit/Debit Card';
    default:
      return method;
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateBillHTML = (order: OrderData): string => {
  const itemsHTML = order.items.map((item, index) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left;">${index + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left;">
        <strong>${item.name}</strong><br>
        <span style="color: #6b7280; font-size: 12px;">Store: ${item.store}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const totalSavings = order.items.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${order.order_number}</title>
  <style>
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6; padding: 20px; }
    .invoice-container { max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 28px; font-weight: bold; }
    .logo-sub { font-size: 12px; opacity: 0.9; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 24px; margin-bottom: 5px; }
    .invoice-title p { font-size: 14px; opacity: 0.9; }
    .content { padding: 30px; }
    .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; }
    .info-box { flex: 1; min-width: 200px; }
    .info-box h3 { color: #6366f1; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px; }
    .info-box p { color: #374151; font-size: 14px; line-height: 1.6; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table th { background: #f9fafb; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
    .items-table th:nth-child(3), .items-table th:nth-child(4), .items-table th:nth-child(5) { text-align: right; }
    .summary { background: #f9fafb; padding: 20px; border-radius: 8px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .summary-row.total { border-top: 2px solid #e5e7eb; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: bold; color: #6366f1; }
    .savings { color: #10b981; font-weight: 500; }
    .footer { background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { color: #6b7280; font-size: 12px; }
    .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-placed { background: #fef3c7; color: #d97706; }
    .status-processing { background: #dbeafe; color: #2563eb; }
    .status-shipped { background: #ede9fe; color: #7c3aed; }
    .status-delivered { background: #d1fae5; color: #059669; }
    .download-btn { display: block; width: 100%; padding: 15px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 20px; }
    .download-btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div>
        <div class="logo">DealWise</div>
        <div class="logo-sub">Smart Deals & Price Comparison</div>
      </div>
      <div class="invoice-title">
        <h1>INVOICE</h1>
        <p>#${order.order_number}</p>
      </div>
    </div>
    
    <div class="content">
      <div class="info-section">
        <div class="info-box">
          <h3>Order Details</h3>
          <p>
            <strong>Order Number:</strong> ${order.order_number}<br>
            <strong>Order Date:</strong> ${formatDate(order.created_at)}<br>
            <strong>Payment Method:</strong> ${getPaymentMethodLabel(order.payment_method)}<br>
            <strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span>
          </p>
        </div>
        <div class="info-box">
          <h3>Shipping Address</h3>
          <p>
            <strong>${order.shipping_address.fullName}</strong><br>
            ${order.shipping_address.addressLine1}<br>
            ${order.shipping_address.addressLine2 ? order.shipping_address.addressLine2 + '<br>' : ''}
            ${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}<br>
            Phone: ${order.shipping_address.phone}
            ${order.shipping_address.landmark ? '<br>Landmark: ' + order.shipping_address.landmark : ''}
          </p>
        </div>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>Product Details</th>
            <th style="width: 80px; text-align: center;">Qty</th>
            <th style="width: 100px; text-align: right;">Unit Price</th>
            <th style="width: 120px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
      
      <div class="summary">
        <div class="summary-row">
          <span>Subtotal (${order.items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
          <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
        </div>
        ${totalSavings > 0 ? `
        <div class="summary-row savings">
          <span>Total Savings</span>
          <span>-₹${totalSavings.toLocaleString('en-IN')}</span>
        </div>
        ` : ''}
        ${order.discount && order.discount > 0 ? `
        <div class="summary-row savings">
          <span>Discount Applied</span>
          <span>-₹${order.discount.toLocaleString('en-IN')}</span>
        </div>
        ` : ''}
        <div class="summary-row">
          <span>Shipping</span>
          <span style="color: ${order.shipping === 0 ? '#10b981' : 'inherit'}">
            ${order.shipping === 0 ? 'FREE' : '₹' + order.shipping.toLocaleString('en-IN')}
          </span>
        </div>
        <div class="summary-row total">
          <span>Grand Total</span>
          <span>₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
      
      ${order.notes ? `
      <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
        <strong style="color: #d97706;">Delivery Instructions:</strong>
        <p style="color: #92400e; margin-top: 5px;">${order.notes}</p>
      </div>
      ` : ''}
      
      <button class="download-btn no-print" onclick="window.print()">
        🖨️ Print / Download as PDF
      </button>
    </div>
    
    <div class="footer">
      <p>Thank you for shopping with DealWise!</p>
      <p style="margin-top: 5px;">For any queries, contact us at support@dealwise.com</p>
      <p style="margin-top: 10px; font-size: 10px; color: #9ca3af;">
        This is a computer-generated invoice and does not require a signature.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export const downloadBill = (order: OrderData): void => {
  const billHTML = generateBillHTML(order);
  const newWindow = window.open('', '_blank');
  
  if (newWindow) {
    newWindow.document.write(billHTML);
    newWindow.document.close();
  }
};
