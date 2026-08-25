/**
 * Hybrid Email Service
 *
 * PRODUCTION (Render): Brevo HTTP API — cloud hosts like Render block/timeout
 *   outbound SMTP ports (465 & 587 both tested), but HTTPS (443) always works.
 * LOCAL: Gmail SMTP with App Password.
 *
 * Selection: BREVO_API_KEY set hai → Brevo API, warna Gmail SMTP.
 *
 * Gmail App Password (local):
 *   myaccount.google.com → Security → 2-Step Verification ON →
 *   search "App passwords" → create → 16-char password → GMAIL_APP_PASSWORD
 *
 * Brevo (production):
 *   SMTP & API → API Access Keys → xkeysib-... key → BREVO_API_KEY
 *   ⚠️ Security → Authorised IPs → restriction OFF + list empty
 *
 * Public interface: sendEmail(to, subject, html) — fire-and-forget queue.
 */

import nodemailer from 'nodemailer';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const useBrevo = () => Boolean(process.env.BREVO_API_KEY);

// Parse "Name <email@x.com>" into { name, email }
// Also strips stray quotes (Render env vars don't auto-strip them like dotenv)
const parseSender = (raw) => {
  const clean = raw?.replace(/"/g, '').trim();
  const match = clean?.match(/^(.*?)\s*<(.+)>$/);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return { name: 'TOS VSSUT', email: clean };
};

// ── Provider: Brevo HTTP API (production) ──
const sendViaBrevo = async ({ to, subject, html }) => {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: parseSender(process.env.EMAIL_FROM || 'TOS VSSUT <zeeshanfiroz9@gmail.com>'),
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Brevo API ${response.status}: ${body}`);
  }
  return response.json();
};

// ── Provider: Gmail SMTP (local) ──
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 15000, // fail fast instead of hanging
    });
  }
  return transporter;
};

const sendViaGmail = async ({ to, subject, html }) => {
  await getTransporter().sendMail({
    from: `"TOS VSSUT" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendNow = (job) => (useBrevo() ? sendViaBrevo(job) : sendViaGmail(job));

// Simple in-process background queue with retry.
// Emails never block the HTTP response — critical for launch-day bursts.
const emailQueue = [];
let processing = false;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const processQueue = async () => {
  if (processing) return;
  processing = true;

  while (emailQueue.length > 0) {
    const job = emailQueue.shift();
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        await sendNow(job);
        console.log(
          `📧 Email sent via ${useBrevo() ? 'Brevo API' : 'Gmail SMTP'} to ${job.to} (${job.subject})`
        );
        break;
      } catch (err) {
        attempt += 1;
        console.error(
          `📧 Email send failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`
        );
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }
  }

  processing = false;
};

/**
 * Queue an email to be sent in the background. Never throws, never blocks.
 * @param {string} to - recipient
 * @param {string} subject
 * @param {string} html - HTML body
 */
export const sendEmail = (to, subject, html) => {
  emailQueue.push({ to, subject, html });
  processQueue().catch((err) =>
    console.error(`📧 Email queue error: ${err.message}`)
  );
};

/**
 * Provider diagnostic — verifies whichever provider is active.
 * Returns { provider, ok, error } — never leaks secrets.
 */
export const verifyEmail = async () => {
  if (useBrevo()) {
    const sender = parseSender(process.env.EMAIL_FROM || 'TOS VSSUT <zeeshanfiroz9@gmail.com>');
    try {
      await sendViaBrevo({
        to: sender.email,
        subject: 'Diagnostic ping',
        html: '<p>Diagnostic ping — safe to ignore.</p>',
      });
      return { provider: 'brevo-api', ok: true, sender: sender.email };
    } catch (err) {
      return { provider: 'brevo-api', ok: false, error: err.message, sender: sender.email };
    }
  }
  try {
    await getTransporter().verify();
    return { provider: 'gmail-smtp', ok: true };
  } catch (err) {
    return { provider: 'gmail-smtp', ok: false, error: err.message };
  }
};

