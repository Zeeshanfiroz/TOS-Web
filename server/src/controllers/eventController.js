import Event from '../models/Event.js';
import User from '../models/User.js';
import { uploadImage, deleteImage } from '../config/imagekit.js';
import { sendEmail } from '../config/mailer.js';

/**
 * GET /api/events?filter=conduct|participate|all&search=...&page=1&limit=9
 * Public — list events with filter, search and pagination.
 */
export const getEvents = async (req, res) => {
  const { filter = 'organized', search = '', page = 1, limit = 9, includeRsvps = 'false' } = req.query;

  const query = {};
  const normalizedFilter = String(filter).toLowerCase();

  const legacyFilter = normalizedFilter === 'conduct' ? 'organized' : normalizedFilter === 'participate' ? 'participated' : normalizedFilter;

  if (legacyFilter === 'organized' || legacyFilter === 'participated') {
    query.eventType = legacyFilter;
  }

  if (normalizedFilter === 'upcoming') query.date = { $gte: new Date() };
  if (normalizedFilter === 'past') query.date = { $lt: new Date() };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const includeRsvpList = String(includeRsvps).toLowerCase() === 'true';

  const eventQuery = Event.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  if (includeRsvpList) {
    eventQuery.populate('rsvps.user', 'name avatar email');
  } else {
    eventQuery.select('-rsvps');
  }

  const [events, total] = await Promise.all([
    eventQuery.exec(),
    Event.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: events,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

/**
 * GET /api/events/:id
 * Public — event detail (includes RSVP count).
 */
export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('rsvps.user', 'name avatar')
    .populate('queries.user', 'name'); // public Q&A shows asker's first name
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  res.json({ success: true, data: event });
};

/**
 * POST /api/events  (admin, multipart/form-data with optional image)
 */
export const createEvent = async (req, res) => {
  const { title, description, date, location, eventType = 'organized' } = req.body;

  const eventData = {
    title,
    description,
    date,
    location,
    eventType: ['organized', 'participated'].includes(eventType) ? eventType : 'organized',
  };

  // Optional detail fields — only set when provided (never required)
  if (req.body.registrationLink) eventData.registrationLink = req.body.registrationLink.trim();
  if (req.body.ruleBookUrl) eventData.ruleBookUrl = req.body.ruleBookUrl.trim();
  if (req.body.fee) eventData.fee = req.body.fee.trim();
  if (req.body.externalLinks) {
    try {
      const links = typeof req.body.externalLinks === 'string'
        ? JSON.parse(req.body.externalLinks)
        : req.body.externalLinks;
      if (Array.isArray(links) && links.length) {
        eventData.externalLinks = links
          .filter((l) => l?.label && l?.url)
          .map((l) => ({ label: String(l.label).trim().slice(0, 60), url: String(l.url).trim() }));
      }
    } catch {
      // invalid JSON — ignore; the validator already rejects it
    }
  }

  const uploadedFile = req.file || req.files?.image?.[0] || req.files?.banner?.[0];
  if (uploadedFile) {
    const bannerResult = await uploadImage(uploadedFile.buffer, uploadedFile.originalname, '/events');
    eventData.banner = { url: bannerResult.url, fileId: bannerResult.fileId };
  }

  const extraFiles = req.files?.images || [];
  if (extraFiles.length) {
    const uploadedGallery = [];
    for (const file of extraFiles) {
      const result = await uploadImage(file.buffer, file.originalname, '/events');
      uploadedGallery.push({ url: result.url, fileId: result.fileId });
    }
    eventData.gallery = uploadedGallery;
  }

  const event = await Event.create(eventData);
  res.status(201).json({ success: true, data: event });
};

/**
 * PUT /api/events/:id  (admin, multipart/form-data with optional image)
 */
export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const { title, description, date, location, eventType } = req.body;
  if (title) event.title = title;
  if (description) event.description = description;
  if (date) event.date = date;
  if (location) event.location = location;
  if (eventType && ['organized', 'participated'].includes(eventType)) {
    event.eventType = eventType;
  }

  // Optional detail fields — set when provided, clearable with an empty string
  if (req.body.registrationLink !== undefined) {
    event.registrationLink = req.body.registrationLink.trim() || undefined;
  }
  if (req.body.ruleBookUrl !== undefined) {
    event.ruleBookUrl = req.body.ruleBookUrl.trim() || undefined;
  }
  if (req.body.fee !== undefined) {
    event.fee = req.body.fee.trim() || undefined;
  }
  if (req.body.externalLinks !== undefined) {
    try {
      const links = typeof req.body.externalLinks === 'string'
        ? JSON.parse(req.body.externalLinks)
        : req.body.externalLinks;
      event.externalLinks = Array.isArray(links)
        ? links.filter((l) => l?.label && l?.url).map((l) => ({ label: String(l.label).trim().slice(0, 60), url: String(l.url).trim() }))
        : [];
    } catch {
      // invalid JSON — keep existing links; the validator already rejects it
    }
  }

  const uploadedFile = req.file || req.files?.image?.[0] || req.files?.banner?.[0];
  if (uploadedFile) {
    if (event.banner?.fileId) await deleteImage(event.banner.fileId);
    const bannerResult = await uploadImage(uploadedFile.buffer, uploadedFile.originalname, '/events');
    event.banner = { url: bannerResult.url, fileId: bannerResult.fileId };
  }

  const extraFiles = req.files?.images || [];
  if (extraFiles.length) {
    const uploadedGallery = [];
    for (const file of extraFiles) {
      const result = await uploadImage(file.buffer, file.originalname, '/events');
      uploadedGallery.push({ url: result.url, fileId: result.fileId });
    }
    event.gallery = [...(event.gallery || []), ...uploadedGallery];
  }

  await event.save();
  res.json({ success: true, data: event });
};

/**
 * DELETE /api/events/:id  (admin)
 */
export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  if (event.banner?.fileId) await deleteImage(event.banner.fileId);
  await event.deleteOne();

  res.json({ success: true, message: 'Event deleted' });
};

/**
 * POST /api/events/:id/rsvp  (protected — toggle RSVP)
 */
export const toggleRsvp = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  if (event.eventType !== 'organized' || event.date <= new Date()) {
    return res.status(400).json({ success: false, message: 'Interest can only be marked for upcoming organised events.' });
  }

  const userId = req.user._id;
  const existingIndex = event.rsvps.findIndex((r) => r.user.toString() === userId.toString());

  if (existingIndex >= 0) {
    return res.json({
      success: true,
      data: {
        rsvped: true,
        rsvpCount: event.rsvps.length,
        locked: true,
        message: 'You already marked interest for this event and can no longer cancel it.',
      },
    });
  }

  event.rsvps.push({ user: userId });
  await event.save();

  res.json({
    success: true,
    data: {
      rsvped: true,
      rsvpCount: event.rsvps.length,
      locked: true,
      message: 'Marked as interested successfully. This interest is now locked in.',
    },
  });
};

/**
 * GET /api/events/my/rsvps  (protected — events the current user RSVP'd to)
 */
export const myRsvps = async (req, res) => {
  const events = await Event.find({ 'rsvps.user': req.user._id }).sort({ date: 1 });
  res.json({ success: true, data: events });
};

// ─────────────────────────────────────────────────────────────
// Event Queries (Q&A)
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/events/:id/queries  (protected)  body: { question }
 * Member asks a question about an event → ALL admins get an email.
 */
export const askQuery = async (req, res) => {
  const { question } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  event.queries.push({ user: req.user._id, question });
  await event.save();

  // Notify every admin by email (background queue — never blocks the response)
  const admins = await User.find({ role: 'admin' }).select('email');
  const askerName = req.user.name || 'A member';
  const askerEmail = req.user.email;
  const eventUrl = `${process.env.CLIENT_URL}/events/${event._id}`;
  for (const admin of admins) {
    sendEmail(
      admin.email,
      `❓ New question on "${event.title}"`,
      `<h2>New event question</h2>
       <p><strong>${askerName}</strong> (${askerEmail}) asked about
       <strong>${event.title}</strong>:</p>
       <blockquote style="border-left:4px solid #16a34a;padding-left:12px;color:#333;">${question}</blockquote>
       <p><a href="${eventUrl}" style="display:inline-block;padding:10px 20px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;">Open event page</a></p>
       <p style="color:#888;font-size:13px;">Reply from Admin → Manage Events → Queries to answer them by email.</p>`
    );
  }

  res.status(201).json({
    success: true,
    message: 'Question sent! Our team will get back to you soon. 🌱',
    data: { queriesCount: event.queries.length },
  });
};

/**
 * GET /api/events/:id/queries  (admin) — all questions with asker name + email
 */
export const getEventQueries = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('queries.user', 'name email');
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  res.json({ success: true, data: event.queries || [] });
};

/**
 * POST /api/events/:id/queries/:queryId/answer  (admin)  body: { answer }
 * Saves the reply AND emails it to the asker.
 */
export const answerQuery = async (req, res) => {
  const { answer } = req.body;
  const event = await Event.findById(req.params.id).populate('queries.user', 'name email');
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const query = event.queries.id(req.params.queryId);
  if (!query) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }

  query.answer = answer;
  query.answeredAt = new Date();
  await event.save();

  if (query.user?.email) {
    sendEmail(
      query.user.email,
      `Reply to your question on "${event.title}"`,
      `<h2>Your question has been answered 🌱</h2>
       <p>Regarding <strong>${event.title}</strong>, you asked:</p>
       <blockquote style="border-left:4px solid #94a3b8;padding-left:12px;color:#333;">${query.question}</blockquote>
       <p><strong>Team of Sustainability replied:</strong></p>
       <blockquote style="border-left:4px solid #16a34a;padding-left:12px;color:#333;">${answer}</blockquote>
       <p><a href="${process.env.CLIENT_URL}/events/${event._id}">View the event page</a></p>`
    );
  }

  res.json({ success: true, message: 'Reply sent — the member has been emailed.', data: query });
};

// ─────────────────────────────────────────────────────────────
// RSVP list & bulk email (admin)
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/events/:id/rsvps  (admin) — full interested list: name + email
 */
export const getEventRsvps = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('rsvps.user', 'name email joinedAt');
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  res.json({
    success: true,
    data: {
      eventTitle: event.title,
      rsvps: (event.rsvps || []).map((r) => ({
        _id: r._id,
        name: r.user?.name || 'Unknown',
        email: r.user?.email || '—',
        createdAt: r.createdAt,
      })),
    },
  });
};

/**
 * POST /api/events/:id/rsvps/email  (admin)  body: { subject, message }
 * Sends an update email to EVERY interested member of the event.
 */
export const emailRsvps = async (req, res) => {
  const { subject, message } = req.body;
  const event = await Event.findById(req.params.id).populate('rsvps.user', 'name email');
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  // Extract and validate emails — filter out invalid formats to prevent "format error"
  const emailRegex = /^\S+@\S+\.\S+$/;
  const recipients = (event.rsvps || [])
    .map((r) => r.user?.email)
    .filter((email) => email && emailRegex.test(email));

  if (!recipients.length) {
    return res.status(400).json({
      success: false,
      message: 'No interested members with valid email addresses to email yet.',
    });
  }

  // One email per recipient (fire-and-forget queue keeps this fast)
  for (const email of recipients) {
    sendEmail(
      email,
      subject,
      `<h2>${subject}</h2>
       <p>Update about <strong>${event.title}</strong>
       (${new Date(event.date).toLocaleDateString('en-IN')} · ${event.location}) —
       an event you marked yourself interested in:</p>
       <div style="color:#333;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</div>
       <p><a href="${process.env.CLIENT_URL}/events/${event._id}">View event page</a></p>
       <p style="color:#888;font-size:13px;">You received this because you marked interest in this event on the TOS VSSUT website.</p>`
    );
  }

  res.json({
    success: true,
    message: `Update queued for ${recipients.length} interested member(s). 📧`,
  });
};