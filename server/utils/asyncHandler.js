/**
 * Async handler wrapper to eliminate try-catch blocks in route handlers.
 * Wraps an async function and forwards any caught errors to Express's next().
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
