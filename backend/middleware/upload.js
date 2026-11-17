const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const dir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(dir, { recursive: true });

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const storage = multer.diskStorage({
  destination: dir,
  // Random filename + extension from the validated mimetype (never from the user's filename)
  filename: (req, file, cb) => cb(null, `${crypto.randomBytes(16).toString('hex')}${EXT[file.mimetype]}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!EXT[file.mimetype]) return cb(new ApiError(400, 'Only JPG, PNG or WebP images are allowed.'));
    cb(null, true);
  },
}).single('image');

module.exports = upload;
module.exports.uploadDir = dir;
