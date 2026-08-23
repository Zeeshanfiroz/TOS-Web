import nodemailer from 'nodemailer';

// Created lazily on first send so it always picks up fully-loaded env vars
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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
        await getTransporter().sendMail(job.mail);
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
  emailQueue.push({
    mail: {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    },
  });
  processQueue().catch((err) =>
    console.error(`📧 Email queue error: ${err.message}`)
  );
};

export default transporter;