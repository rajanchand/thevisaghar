import { Resend } from "resend";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@thevisaghar.com";

// ─── Email Templates ─────────────────────────────────────────────────────────

function inquiryConfirmationHtml(name: string, visaType: string): string {
  const safeName = escapeHtml(name);
  const safeVisaType = escapeHtml(visaType);
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0B1F4B; padding: 32px; text-align: center;">
        <h1 style="color: #C9A84C; margin: 0; font-size: 24px;">The Visa Ghar</h1>
        <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px;">Your Trusted Immigration Partner</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #0B1F4B; margin-top: 0;">Thank you for your inquiry, ${safeName}!</h2>
        <p style="color: #444; line-height: 1.6;">
          We have received your inquiry regarding <strong>${safeVisaType}</strong>. Our team will review your message and get back to you within 24 hours.
        </p>
        <p style="color: #444; line-height: 1.6;">
          In the meantime, you can book a free consultation with our experts:
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://thevisaghar.com/book" style="background: #C9A84C; color: #0B1F4B; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Book Free Consultation
          </a>
        </div>
      </div>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #888;">
        <p>The Visa Ghar | Kathmandu, Nepal</p>
        <p>© ${new Date().getFullYear()} The Visa Ghar. All rights reserved.</p>
      </div>
    </div>
  `;
}

function bookingConfirmationHtml(name: string, visaType: string, date: string): string {
  const safeName = escapeHtml(name);
  const safeVisaType = escapeHtml(visaType);
  const safeDate = escapeHtml(date);
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0B1F4B; padding: 32px; text-align: center;">
        <h1 style="color: #C9A84C; margin: 0; font-size: 24px;">The Visa Ghar</h1>
        <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px;">Consultation Booking Confirmed</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #0B1F4B; margin-top: 0;">Booking Confirmed, ${safeName}!</h2>
        <div style="background: #f8f6f0; border-left: 4px solid #C9A84C; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
          <p style="margin: 0; color: #444;"><strong>Visa Type:</strong> ${safeVisaType}</p>
          <p style="margin: 8px 0 0; color: #444;"><strong>Preferred Date:</strong> ${safeDate}</p>
        </div>
        <p style="color: #444; line-height: 1.6;">
          Our team will contact you shortly to confirm the exact time for your consultation. Please keep your phone available.
        </p>
        <p style="color: #444; line-height: 1.6;">
          <strong>What to prepare:</strong>
        </p>
        <ul style="color: #444; line-height: 1.8;">
          <li>Valid passport</li>
          <li>Any previous visa documents</li>
          <li>Educational certificates (if applicable)</li>
          <li>Financial documents (bank statements)</li>
        </ul>
      </div>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #888;">
        <p>The Visa Ghar | Kathmandu, Nepal</p>
        <p>© ${new Date().getFullYear()} The Visa Ghar. All rights reserved.</p>
      </div>
    </div>
  `;
}

function adminNotificationHtml(type: string, details: Record<string, string>): string {
  const detailRows = Object.entries(details)
    .map(([key, value]) => `<tr><td style="padding: 8px; font-weight: 600; color: #0B1F4B;">${escapeHtml(key)}</td><td style="padding: 8px; color: #444;">${escapeHtml(value)}</td></tr>`)
    .join("");

  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0B1F4B; padding: 24px; text-align: center;">
        <h1 style="color: #C9A84C; margin: 0; font-size: 20px;">New ${type}</h1>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${detailRows}
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://thevisaghar.com/admin/dashboard" style="background: #0B1F4B; color: #C9A84C; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            View in Admin Panel
          </a>
        </div>
      </div>
    </div>
  `;
}

// ─── Send Functions ──────────────────────────────────────────────────────────

export async function sendInquiryConfirmation(email: string, name: string, visaType: string) {
  if (!resend) {
    console.log("[Email Mock] Inquiry confirmation →", email);
    return { success: true, mock: true };
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Thank you for contacting The Visa Ghar",
    html: inquiryConfirmationHtml(name, visaType),
  });

  if (error) {
    console.error("Failed to send inquiry confirmation:", error);
    return { success: false, error };
  }
  return { success: true };
}

export async function sendBookingConfirmation(email: string, name: string, visaType: string, date: string) {
  if (!resend) {
    console.log("[Email Mock] Booking confirmation →", email);
    return { success: true, mock: true };
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Consultation Booking Confirmed — The Visa Ghar",
    html: bookingConfirmationHtml(name, visaType, date),
  });

  if (error) {
    console.error("Failed to send booking confirmation:", error);
    return { success: false, error };
  }
  return { success: true };
}

export async function sendAdminNotification(type: string, details: Record<string, string>) {
  if (!resend) {
    console.log(`[Email Mock] Admin notification: ${type}`, details);
    return { success: true, mock: true };
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: process.env.ADMIN_NOTIFICATION_EMAIL || "admin@thevisaghar.com",
    subject: `New ${type} — The Visa Ghar`,
    html: adminNotificationHtml(type, details),
  });

  if (error) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error };
  }
  return { success: true };
}
