import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleRsvp,
  myRsvps,
} from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import { eventValidator } from '../validators/eventValidators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// NOTE: static paths must come BEFORE /:id so they aren't swallowed by it
router.get('/', getEvents);
router.get('/my/rsvps', protect, myRsvps);
router.get('/:id', getEventById);

// Protected (any logged-in member)
router.post('/:id/rsvp', protect, toggleRsvp);

// Admin only
router.post(
  '/',
  protect,
  adminOnly,
  uploadSingle,
  eventValidator,
  validate,
  createEvent
);
router.put(
  '/:id',
  protect,
  adminOnly,
  uploadSingle,
  eventValidator,
  validate,
  updateEvent
);
router.delete('/:id', protect, adminOnly, deleteEvent);

export default router;