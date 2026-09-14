import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleRsvp,
  myRsvps,
  askQuery,
  getEventQueries,
  answerQuery,
  getEventRsvps,
  emailRsvps,
} from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadEventMedia } from '../middleware/upload.js';
import {
  eventValidator,
  askQueryValidator,
  answerQueryValidator,
  emailRsvpsValidator,
} from '../validators/eventValidators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// NOTE: static paths must come BEFORE /:id so they aren't swallowed by it
router.get('/', getEvents);
router.get('/my/rsvps', protect, myRsvps);
router.get('/:id', getEventById);

// Protected (any logged-in member)
router.post('/:id/rsvp', protect, toggleRsvp);
router.post('/:id/queries', protect, askQueryValidator, validate, askQuery);

// Admin only — queries
router.get('/:id/queries', protect, adminOnly, getEventQueries);
router.post(
  '/:id/queries/:queryId/answer',
  protect,
  adminOnly,
  answerQueryValidator,
  validate,
  answerQuery
);

// Admin only — interested list + bulk email
router.get('/:id/rsvps', protect, adminOnly, getEventRsvps);
router.post(
  '/:id/rsvps/email',
  protect,
  adminOnly,
  emailRsvpsValidator,
  validate,
  emailRsvps
);

// Admin only
router.post(
  '/',
  protect,
  adminOnly,
  uploadEventMedia,
  eventValidator,
  validate,
  createEvent
);
router.put(
  '/:id',
  protect,
  adminOnly,
  uploadEventMedia,
  eventValidator,
  validate,
  updateEvent
);
router.delete('/:id', protect, adminOnly, deleteEvent);

export default router;