import { Router } from 'express';
import {
  getGallery,
  uploadGalleryImages,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = Router();

router.get('/', getGallery);

router.post(
  '/',
  protect,
  adminOnly,
  uploadMultiple,
  uploadGalleryImages
);
router.delete('/:id', protect, adminOnly, deleteGalleryImage);

export default router;