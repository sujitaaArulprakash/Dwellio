const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determine upload directory:
// On Vercel / serverless environments, the filesystem is read-only except for /tmp.
// For local development, keep the existing path (../uploads).
const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel ? '/tmp/uploads' : path.join(__dirname, '../uploads');

// Ensure upload directory exists safely with recursive: true
const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
      console.warn(`Could not create upload directory at ${uploadDir}:`, err.message);
    }
  }
};

// Ensure directory is initialized
ensureUploadDir();

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File validation
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpeg, jpg, png, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
