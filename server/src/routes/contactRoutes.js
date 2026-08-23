import { Router } from 'express';
import {
  submitContact,
  getMessages,
  updateMessageStatus,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { contactValidator } from '../validators/contactValidators.js';

const router = Router();

// Public — anyone can send a message
router.post('/', contactValidator, validate, submitContact);

// Admin only
router.get('/', protect, adminOnly, getMessages);
router.put('/:id/status', protect, adminOnly, updateMessageStatus);

export default router;