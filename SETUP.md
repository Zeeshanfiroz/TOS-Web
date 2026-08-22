# Phase 0 — Setup Guide (Step by Step)

## Step 1: MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas and click **"Try Free"** / **Sign Up** (or sign in with Google).
2. Create a **free M0 cluster**:
   - Choose "Build a Database" → select the **Free (M0)** tier.
   - Pick a cloud provider/region close to you (e.g., AWS, Mumbai for India).
   - Cluster name: `club-cluster` (or default `Cluster0`). Click **Create**.
3. **Create a database user** (popup appears after cluster creation):
   - Username: `clubadmin`
   - Password: click "Autogenerate" and **copy it somewhere safe** (you'll need it for MONGO_URI).
   - Click **Create User**.
4. **Allow network access**:
   - Left sidebar → **Network Access** → **Add IP Address**.
   - For development, click **"Allow Access from Anywhere"** (0.0.0.0/0). You can restrict later.
5. **Get your connection string**:
   - Left sidebar → **Database** → click **Connect** on your cluster.
   - Choose **"Drivers"** → Node.js.
   - Copy the string, it looks like:
     `mongodb+srv://clubadmin:<password>@club-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password (URL-encode special chars: `@` → `%40`, `#` → `%23`).
   - Add a database name before the `?`: `...mongodb.net/clubdb?retryWrites=true...`
6. Paste the final string into `server/.env` as `MONGO_URI`.

## Step 1b: Connect MongoDB Compass to Atlas (Optional, for viewing data)

1. Download & install Compass: https://www.mongodb.com/products/compass
2. Open Compass → click **"New Connection"**.
3. Paste the **same MONGO_URI** you put in `server/.env` (with your real password).
4. Click **Connect** — you'll see your `clubdb` database (it appears once data exists).
5. Use it anytime to view/edit users, events, etc. — especially later when
   bootstrapping the first admin (set `"role": "admin"` on your user document).

> Note: The backend connects to Atlas directly via Mongoose. Compass is only
> a viewer/GUI — the project works without it.

## Step 2: ImageKit (Image Storage & CDN)

1. Go to https://imagekit.io and click **"Start for free"** / Sign Up.
2. After signup, go to **Dashboard → Developer options** (left sidebar).
3. Copy these three values:
   - **URL Endpoint** (looks like `https://ik.imagekit.io/your_imagekit_id`)
   - **Public Key**
   - **Private Key** (click the eye icon to reveal)
4. Paste all three into `server/.env`:
   - `IMAGEKIT_URL_ENDPOINT`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`

> Why ImageKit works great here: free tier includes 20GB bandwidth/month,
> automatic image optimization, and on-the-fly resizing via URL params
> (e.g., append `?tr=w-800,q-80` to any image URL). Server-side uploads use
> the official `imagekit` Node.js SDK with the private key — same pattern
> as Cloudinary.

## Step 3: Email Credentials (Nodemailer)

> ⚠️ **IMPORTANT — Do NOT use Gmail app passwords for this project.**
> Gmail limits you to ~500 emails/day and throttles bursts. At launch,
> 500 people signing up at once would cause failed/silent emails.
> Use a transactional email service instead:

**Option A — Brevo (RECOMMENDED for launch, 300 emails/day FREE):**
1. Sign up at https://www.brevo.com (free plan, no credit card).
2. Go to **SMTP & API** page (profile menu → SMTP & API).
3. Under SMTP, click **Generate new SMTP key** — copy it.
4. In `server/.env`:
   - `EMAIL_HOST=smtp-relay.brevo.com`
   - `EMAIL_PORT=587`
   - `EMAIL_USER=your_brevo_login_email`
   - `EMAIL_PASS=the_generated_smtp_key`

**Option B — Resend (modern, great deliverability, 3,000 emails/month free):**
1. Sign up at https://resend.com → verify your domain (or use onboarding sender).
2. Create an **API key** → use Resend's official Node SDK or their SMTP bridge
   (`smtp.resend.com`, port 465) with Nodemailer.
3. Put the credentials in `server/.env` same as above.

**Option C — Mailtrap (development/testing ONLY):**
1. Sign up at https://mailtrap.io → create an inbox.
2. Copy the SMTP username/password into `EMAIL_USER` / `EMAIL_PASS`.
   Emails land in a fake inbox — nothing is actually delivered.

## Step 4: JWT Secret

Generate a strong random secret. In a terminal run:
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output into `JWT_SECRET` in `server/.env`.

## Step 5: Git Repository

```
git init
git add .
git commit -m "Phase 0: project scaffolding"
```
Then create a repo on GitHub and push:
```
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

## Step 6: Production Hardening (for ~500 simultaneous signups)

The backend will be built with these from day one:

1. **Non-blocking emails** — Signup/contact responses return immediately;
   emails are sent in the background (async queue with retry), so a slow
   email server never blocks registration.
2. **Rate limiting tuned for launch** — Global limiter generous enough that
   500 real users aren't blocked; strict limiter ONLY on repeated failed logins.
3. **MongoDB connection pooling** — Mongoose `maxPoolSize` configured;
   Atlas M0 supports 500 connections (enough). Upgrade to M10 ($9/mo) if
   you expect sustained heavy traffic.
4. **Database indexes** — Unique index on `user.email`, index on event dates,
   RSVP user lookups — prevents slow queries under load.
5. **compression + helmet + trust proxy** — Faster responses behind Render's
   proxy, secure headers, gzip.
6. **Graceful error handling** — Centralized handler so one failing request
   never crashes the server during peak traffic.
7. **Frontend** — Debounced search, pagination on events/gallery lists,
   lazy-loaded images (ImageKit URL params handle resizing).

## ✅ Phase 0 Checklist

- [x] MongoDB Atlas cluster created, user created, IP whitelisted
- [x] MONGO_URI pasted into server/.env
- [ ] ImageKit account created, 3 credentials pasted into server/.env
- [ ] Email service credentials (Brevo/Resend — NOT Gmail) in server/.env
- [ ] JWT_SECRET generated and set
- [ ] Git repo initialized and pushed to GitHub