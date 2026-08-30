import { body } from 'express-validator';

export const projectValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ max: 150 }).withMessage('Title is too long'),
  body('summary')
    .trim()
    .notEmpty().withMessage('Project summary is required')
    .isLength({ max: 220 }).withMessage('Summary is too long'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 80 }).withMessage('Category is too long'),
  body('tags')
    .optional()
    .custom((value) => {
      if (!value) return true;

      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (!Array.isArray(parsed)) throw new Error('Tags must be an array');
      return true;
    })
    .withMessage('Tags must be an array'),
  body('status')
    .optional()
    .isIn(['active', 'completed']).withMessage('Status must be active or completed'),
];
