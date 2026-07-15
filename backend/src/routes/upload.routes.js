const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Rate limiting
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour per IP
  message: 'Too many file uploads from this IP, please try again after an hour'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'droneco_uploads',
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }] // Optional: resize large images
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const { protect } = require('../middleware/authentication/authMiddleware');

router.post('/', protect, uploadLimiter, (req, res) => {
  upload.single('document')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('MulterError:', err);
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({ success: false, message: err.message || err.toString() });
    }
    
    if (!req.file) {
      console.error('No file uploaded in req');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Cloudinary returns the full URL in req.file.path
    res.json({ success: true, filePath: req.file.path });
  });
});

module.exports = router;
