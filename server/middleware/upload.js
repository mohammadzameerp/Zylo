const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Multer memory storage configuration.
 * Stores files in memory as a Buffer object.
 */
const storage = multer.memoryStorage();

/**
 * File filter: Accept only image files (jpeg, jpg, png, gif, webp).
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse(
        'Only image files are allowed (jpeg, jpg, png, gif, webp)',
        400
      ),
      false
    );
  }
};

/**
 * Configured multer instance.
 * - Storage: disk (server/uploads/)
 * - Max file size: 5MB
 * - Allowed: images only
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

module.exports = upload;
