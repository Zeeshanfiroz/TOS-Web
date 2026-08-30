import Event from '../models/Event.js';
import { uploadImage, deleteImage } from '../config/imagekit.js';

/**
 * GET /api/events?filter=conduct|participate|all&search=...&page=1&limit=9
 * Public — list events with filter, search and pagination.
 */
export const getEvents = async (req, res) => {
  const { filter = 'organized', search = '', page = 1, limit = 9 } = req.query;

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

  const [events, total] = await Promise.all([
    Event.find(query)
      .sort(normalizedFilter === 'participated' || normalizedFilter === 'past' ? { date: -1 } : { date: 1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-rsvps'),
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
  const event = await Event.findById(req.params.id).populate('rsvps.user', 'name avatar');
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

  const userId = req.user._id;
  const index = event.rsvps.findIndex((r) => r.user.toString() === userId.toString());

  let rsvped;
  if (index >= 0) {
    event.rsvps.splice(index, 1); // cancel RSVP
    rsvped = false;
  } else {
    event.rsvps.push({ user: userId }); // add RSVP
    rsvped = true;
  }

  await event.save();
  res.json({ success: true, data: { rsvped, rsvpCount: event.rsvps.length } });
};

/**
 * GET /api/events/my/rsvps  (protected — events the current user RSVP'd to)
 */
export const myRsvps = async (req, res) => {
  const events = await Event.find({ 'rsvps.user': req.user._id }).sort({ date: 1 });
  res.json({ success: true, data: events });
};