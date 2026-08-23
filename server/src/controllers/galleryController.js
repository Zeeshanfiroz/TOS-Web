import Gallery from '../models/Gallery.js';
import { uploadImage, deleteImage } from '../config/imagekit.js';

/**
 * GET /api/gallery?eventRef=<id>&page=1&limit=24
 * Public — paginated gallery, optionally filtered by event.
 */
export const getGallery = async (req, res) => {
  const { eventRef, page = 1, limit = 24 } = req.query;

  const query = {};
  if (eventRef) query.eventRef = eventRef;

  const skip = (Number(page) - 1) * Number(limit);

  const [images, total] = await Promise.all([
    Gallery.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('eventRef', 'title'),
    Gallery.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: images,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

/**
 * POST /api/gallery  (admin — bulk upload up to 10 images)
 * multipart/form-data: images[] + optional caption + optional eventRef
 */
export const uploadGalleryImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No images provided' });
  }

  const { caption = '', eventRef = null } = req.body;
  const uploaded = [];
  const failed = [];

  // Upload each image; one failure doesn't abort the rest
  for (const file of req.files) {
    try {
      const result = await uploadImage(file.buffer, file.originalname, '/gallery');
      const doc = await Gallery.create({
        imageUrl: result.url,
        fileId: result.fileId,
        caption,
        eventRef: eventRef || null,
      });
      uploaded.push(doc);
    } catch (err) {
      failed.push({ fileName: file.originalname, reason: err.message });
    }
  }

  res.status(201).json({
    success: true,
    data: uploaded,
    ...(failed.length > 0 && { failed }),
  });
};

/**
 * DELETE /api/gallery/:id  (admin)
 */
export const deleteGalleryImage = async (req, res) => {
  const image = await Gallery.findById(req.params.id);
  if (!image) {
    return res.status(404).json({ success: false, message: 'Image not found' });
  }

  await deleteImage(image.fileId);
  await image.deleteOne();

  res.json({ success: true, message: 'Image deleted' });
};