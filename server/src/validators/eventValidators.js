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
  body('eventType')
    .optional()
    .isIn(['organized', 'participated']).withMessage('Event type must be organized or participated'),
  // ── Optional detail fields (never required) ──
  body('registrationLink')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Registration link must be a valid URL (https://...)'),
  body('ruleBookUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Rule book link must be a valid URL (https://...)'),
  body('fee')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Fee must be under 100 characters'),
  body('externalLinks')
    .optional({ checkFalsy: true })
    .custom((value) => {
      // Arrives as a JSON string via multipart FormData
      let links = value;
      if (typeof value === 'string') {
        try {
          links = JSON.parse(value);
        } catch {
          throw new Error('External links must be valid JSON');
        }
      }
      if (!Array.isArray(links)) throw new Error('External links must be an array');
      for (const link of links) {
        if (!link?.label || !link?.url) throw new Error('Each link needs a label and URL');
        if (!/^https?:\/\/.+/.test(link.url)) throw new Error(`Link "${link.label}" must be a valid http(s) URL`);
        if (String(link.label).length > 60) throw new Error('Link labels must be under 60 characters');
      }
      return true;
    }),
];