# 🌱 Team of Sustainability (TOS) — VSSUT Burla Club Website

A full-stack web platform for a college sustainability club: public website,
member accounts with event RSVPs, and a complete admin panel.

## Tech Stack

| Layer     | Technology                                                        |
|-----------|-------------------------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router      |
| Forms     | Formik + Yup                                                      |
| Animation | Framer Motion                                                     |
| Backend   | Node.js, Express, MongoDB (Mongoose)                              |
| Auth      | JWT in httpOnly cookies                                           |
| Images    | ImageKit (cloud storage + CDN)                                    |
| Email     | Nodemailer via Brevo SMTP                                         |

## Features

### Public
- Animated home page (hero, stats counters, floating leaves)
- Events list with upcoming/past filter + search + pagination
- Event detail pages with RSVP and attendee list
- Photo gallery with masonry grid, lightbox & keyboard navigation
- Announcements/blog list + detail
- Team page, About page (mission/vision/timeline)
- Contact form → saves to DB + emails the club inbox

### Members (logged in)
- Personal dashboard with RSVP count and joined events

### Admins
- Dashboard with live stats
- Create/edit/delete events (with banner upload to ImageKit)
- Publish/edit/delete announcements
- Bulk gallery uploads (up to 10 images) linked to events
- Member management: promote/demote admins, remove members
- Contact inbox with resolve workflow

### Security
- httpOnly cookie sessions (XSS-safe token storage)
- Rate limiting on auth endpoints + global limiter
- Helmet security headers, CORS restricted to frontend origin
- Input validation on every endpoint (express-validator)

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # Axios instance
│       ├── app/         # Redux store
│       ├── components/  # Layout, UI, routing guards
│       ├── features/    # Redux slices (auth, events, ...)
│       └── pages/       # public / auth / member / admin
└── server/          # Express API
    └── src/
        ├── config/       # db, mailer, imagekit
        ├── controllers/
        ├── middleware/   # auth, upload, validate, error
        ├── models/
        ├── routes/
        ├── validators/
        └── seeder.js     # sample data script
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (free tier works)
- An ImageKit account (free tier works) — for image uploads
- A Brevo account (free tier works) — for transactional email

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env   # then fill in your values (see SETUP.md for details)
npm run seed           # creates admin user + sample data
npm run dev            # starts API on http://localhost:5000
```

**Seeded login credentials:**
- Admin: `admin@club.com` / `admin12345`
- Member: `member@club.com` / `member12345`

> ⚠️ Change these passwords before going live!

### 2. Frontend setup

```bash
cd client
npm install
npm run dev            # starts app on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `localhost:5000` — no CORS
setup needed during development.

## Deployment (free tiers)

1. **Backend** → [Render](https://render.com) or Railway
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add all env vars from `server/.env.example`
2. **Frontend** → [Vercel](https://vercel.com) or Netlify
   - Root directory: `client`
   - Build command: `npm run build`, output: `dist`
   - Set `VITE_API_URL=https://your-api.onrender.com/api`
3. Update `CLIENT_URL` on the backend to your deployed frontend URL.
4. Re-seed production DB once (`npm run seed`) — or register an admin manually
   and promote them from another admin account / Mongo Atlas console.

See **SETUP.md** for detailed service-by-service configuration instructions.