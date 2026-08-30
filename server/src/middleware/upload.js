import multer from 'multer';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed'));
  }
};

// Single file upload — accepts both current `image` and legacy `banner` names.
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]);

// Multiple files — accepts both `images` and `image` for compatibility.
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE, files: 10 },
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'image', maxCount: 10 },
]);