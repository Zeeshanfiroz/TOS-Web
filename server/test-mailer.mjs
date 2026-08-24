/**
 * Standalone Gmail SMTP test — app se bilkul alag.
 * Run: cd server && node test-mailer.mjs
 *
 * Requires in .env:
 *   GMAIL_USER=you@gmail.com
 *   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx  (16-char App Password, NOT normal password)
 *
 * App Password banane ke liye:
 *   1. myaccount.google.com → Security → 2-Step Verification ON karo
 *   2. Google Account → search "App passwords" → create (name: "club")
 *   3. 16-character password copy karke .env mein daalo
 */
import 'dotenv/config';
import nodemailer from 'nodemailer';

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

console.log('── .env config ─────────────────────────────');
console.log('GMAIL_USER:', user || '❌ MISSING');
console.log('GMAIL_APP_PASSWORD:', pass ? `✅ set (${pass.slice(0, 4)}... ${pass.length} chars)` : '❌ MISSING');
console.log('');

if (!user || !pass) {
  console.error('❌ .env mein GMAIL_USER / GMAIL_APP_PASSWORD missing hai!');
  process.exit(1);
}
if (pass.length !== 16) {
  console.error(`⚠️  App Password 16 characters ka hona chahiye (abhi ${pass.length}).`);
  console.error('   Spaces hata do ya naya App Password generate karo.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user, pass },
  connectionTimeout: 15000,
});

try {
  console.log('── Sending test email via Gmail ────────────');
  const info = await transporter.sendMail({
    from: `"Sustainability Club" <${user}>`,
    to: user, // send to yourself
    subject: '✅ Gmail SMTP Test — GreenSoul Club',
    html: `<h2>It works! 🌱</h2><p>Email sending via Gmail App Password is fully
           functional. Sent at ${new Date().toLocaleString('en-IN')}.</p>`,
  });
  console.log('✅ EMAIL SENT!');
  console.log('   Message ID:', info.messageId);
  console.log('');
  console.log(`📩 Inbox check karo: ${user} (spam folder bhi dekh lena)`);
} catch (err) {
  console.error('❌ FAILED:', err.message);
  console.error('');
  if (err.message.includes('Invalid login') || err.message.includes('Username and Password not accepted')) {
    console.error('→ App Password galat hai ya 2-Step Verification OFF hai.');
    console.error('  1. myaccount.google.com → Security → 2-Step Verification ON');
    console.error('  2. Search "App passwords" → naya banao → .env mein daalo (16 chars, no spaces)');
  }
  if (err.message.includes('ETIMEDOUT') || err.message.includes('ECONNREFUSED')) {
    console.error('→ Network ne SMTP port (465) block kiya hai. VPN/proxy check karo.');
  }
  process.exit(1);
}


