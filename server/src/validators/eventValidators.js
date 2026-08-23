import { body } from 'express-validator';

export const eventValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required')
    .isLength({ max: 150 }).withMessage('Title is too long'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('date')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Date must be a valid date'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
];