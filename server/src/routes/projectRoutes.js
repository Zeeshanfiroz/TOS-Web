import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadEventMedia } from '../middleware/upload.js';
import { projectValidator } from '../validators/projectValidators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);

router.post('/', protect, adminOnly, uploadEventMedia, projectValidator, validate, createProject);
router.put('/:id', protect, adminOnly, uploadEventMedia, projectValidator, validate, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

export default router;
