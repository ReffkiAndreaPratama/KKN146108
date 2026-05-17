import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
    }

    // ── Kirim email via Resend ──────────────────────────────
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL       = process.env.CONTACT_EMAIL ?? "kkn146@unib.ac.id";

    if (RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);

      await resend.emails.send({
        from:    "KKN 146 <onboarding@resend.dev>",
        to:      [TO_EMAIL],
        replyTo: email,
        subject: `[KKN 146] Pesan dari ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0f1e;color:#f0f4ff;border-radius:12px;">
            <div style="background:linear-gradient(135deg,#10b981,#06b6d4);height:4px;border-radius:4px;margin-bottom:24px;"></div>
            <h2 style="margin:0 0 8px;font-size:18px;">Pesan Baru dari Website KKN 146</h2>
            <p style="color:#8b9ab8;font-size:13px;margin:0 0 24px;">Diterima melalui form kontak landing page</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#8b9ab8;font-size:13px;width:100px;">Nama</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-size:13px;">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#8b9ab8;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-size:13px;"><a href="mailto:${email}" style="color:#10b981;">${email}</a></td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
              <p style="color:#8b9ab8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Pesan</p>
              <p style="font-size:14px;line-height:1.6;margin:0;">${message.replace(/\n/g, "<br>")}</p>
            </div>
            <p style="color:#4a5878;font-size:12px;margin-top:24px;text-align:center;">KKN 146 · Desa Talang Marap · Universitas Bengkulu</p>
          </div>
        `,
      });
    }

    // ── Log ke console jika tidak ada API key ──────────────
    if (!RESEND_API_KEY) {
      console.log("[Contact Form]", { name, email, message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact API]", err);
    return NextResponse.json({ error: "Gagal mengirim pesan." }, { status: 500 });
  }
}
