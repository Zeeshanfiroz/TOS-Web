import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser, getPublicStats } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public aggregate stat (must be registered before the admin-only routes)
router.get('/stats', getPublicStats);

// All user management is admin-only
router.get('/', protect, adminOnly, getUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;