/**
 * Wraps an async route handler so any rejected promise
 * is forwarded to the centralized error middleware.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;