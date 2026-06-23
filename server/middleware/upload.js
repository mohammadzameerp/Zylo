const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/ErrorResponse');

// Resolve the uploads directory relative to the server root
const uploadsDir = path.join(__dirname, '..', 'uploads');

/**
 * Multer disk storage configuration.
 * Stores files in server/uploads/ with unique filenames.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: fieldname-timestamp-random.extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

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
