import "server-only";

/**
 * Email skeleton. When SMTP_* env vars are set it sends via nodemailer;
 * otherwise it logs to the console (development). Replace/extend in production.
 */
export type MailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendMail(mail: MailInput): Promise<{ sent: boolean }> {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.log("📧 [DEV MAIL] →", mail.to, "|", mail.subject);
    console.log(mail.text ?? mail.html.replace(/<[^>]+>/g, "").slice(0, 200));
    return { sent: false };
  }

  const nodemailer = (await import("nodemailer")).default;
  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({
    from: process.env.SMTP_FROM || "no-reply@example.com",
    ...mail,
  });
  return { sent: true };
}

// --- Templates ------------------------------------------------------------
export function orderShippedEmail(opts: {
  name: string;
  orderNumber: string;
  cargoCompany: string;
  trackingNumber: string;
}) {
  return {
    subject: `Siparişiniz kargoya verildi — ${opts.orderNumber}`,
    html: `<p>Merhaba ${opts.name},</p>
<p><strong>${opts.orderNumber}</strong> numaralı siparişiniz kargoya verildi.</p>
<p>Kargo firması: <strong>${opts.cargoCompany}</strong><br/>
Takip numarası: <strong>${opts.trackingNumber}</strong></p>
<p>Teşekkür ederiz.</p>`,
  };
}

export function abandonedCartEmail(opts: { orderHint?: string }) {
  return {
    subject: "Sepetinizdeki ürünleri unutmayın 🛒",
    html: `<p>Sepetinizde ürünler sizi bekliyor! Stoklar tükenmeden tamamlayın.</p>
<p>%10 indirim için <strong>HOSGELDIN10</strong> kodunu kullanabilirsiniz.${opts.orderHint ?? ""}</p>`,
  };
}
