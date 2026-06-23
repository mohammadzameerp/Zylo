const { body, validationResult } = require('express-validator');

/**
 * Validation chain for user registration.
 */
const validateRegister = [
  body('anonymousName')
    .notEmpty()
    .withMessage('Anonymous name is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Anonymous name must be between 3 and 30 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

/**
 * Validation chain for user login.
 */
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation chain for creating/updating a post.
 */
const validatePost = [
  body('content')
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ max: 2000 })
    .withMessage('Post content cannot exceed 2000 characters')
    .trim(),
];

/**
 * Validation chain for creating a comment.
 */
const validateComment = [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
    .trim(),
];

/**
 * Middleware to run after validation chains.
 * Checks for validation errors and returns 400 with errors array if any exist.
 */
const runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePost,
  validateComment,
  runValidation,
};
