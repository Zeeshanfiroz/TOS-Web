/**
 * Email via Gmail SMTP with App Password.
 *
 * Why Gmail instead of Brevo:
 *  • NO IP restrictions — works from any network (dynamic IPs fine)
 *  • No extra signup — uses your existing Google account
 *  • Free: 500 emails/day (plenty for a college club)
 *
 * One-time setup (2 min):
 *  1. myaccount.google.com → Security → turn ON "2-Step Verification"
 *  2. Google Account → search "App passwords" → create one (name: "club")
 *  3. Copy the 16-character password into .env → GMAIL_APP_PASSWORD
 *
 * Requires in .env:
 *  GMAIL_USER=you@gmail.com
 *  GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx   (16 chars, NOT your normal password)
 *
 * Public interface: sendEmail(to, subject, html) — fire-and-forget queue.
 */

import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    // Port 587 (STARTTLS) — some cloud hosts (like Render) have flaky/blocked
    // outbound 465; 587 is the standard mail-submission port and usually open.
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // 587 = STARTTLS (upgrades after connect)
      tls: { rejectUnauthorized: true },
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 15000, // fail fast instead of hanging
    });
  }
  return transporter;
};

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
        await getTransporter().sendMail({
          from: `"TOS VSSUT" <${process.env.GMAIL_USER}>`,
          ...job,
        });
        console.log(`📧 Email sent successfully to ${job.to} (${job.subject})`);
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
 * SMTP diagnostic — verifies the Gmail credentials actually work.
 * Returns { ok: true } or { ok: false, error } — never leaks secrets.
 */
export const verifyEmail = async () => {
  try {
    await getTransporter().verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
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

