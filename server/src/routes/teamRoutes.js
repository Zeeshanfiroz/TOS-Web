import { Router } from 'express';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.get('/', getTeamMembers);
router.post('/', protect, adminOnly, uploadSingle, createTeamMember);
router.put('/:id', protect, adminOnly, uploadSingle, updateTeamMember);
router.delete('/:id', protect, adminOnly, deleteTeamMember);

export default router;
