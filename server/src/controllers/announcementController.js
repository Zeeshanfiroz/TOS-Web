import Announcement from '../models/Announcement.js';

/**
 * GET /api/announcements?page=1&limit=10
 * Public — paginated list, newest first.
 */
export const getAnnouncements = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [announcements, total] = await Promise.all([
    Announcement.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'name'),
    Announcement.countDocuments(),
  ]);

  res.json({
    success: true,
    data: announcements,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

/**
 * GET /api/announcements/:id
 * Public — single announcement.
 */
export const getAnnouncementById = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id).populate('author', 'name');
  if (!announcement) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }
  res.json({ success: true, data: announcement });
};

/**
 * POST /api/announcements  (admin)
 */
export const createAnnouncement = async (req, res) => {
  const { title, content } = req.body;
  const announcement = await Announcement.create({
    title,
    content,
    author: req.user._id,
  });
  res.status(201).json({ success: true, data: announcement });
};

/**
 * PUT /api/announcements/:id  (admin)
 */
export const updateAnnouncement = async (req, res) => {
  const { title, content } = req.body;
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }
  if (title) announcement.title = title;
  if (content) announcement.content = content;
  await announcement.save();
  res.json({ success: true, data: announcement });
};

/**
 * DELETE /api/announcements/:id  (admin)
 */
export const deleteAnnouncement = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }
  await announcement.deleteOne();
  res.json({ success: true, message: 'Announcement deleted' });
};