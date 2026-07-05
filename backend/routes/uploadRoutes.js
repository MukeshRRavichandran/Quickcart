import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Endpoint to upload multiple files
router.post('/', upload.fields([
  { name: 'aadhaarFile', maxCount: 1 },
  { name: 'panFile', maxCount: 1 },
  { name: 'licenseFile', maxCount: 1 }
]), (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }
    
    // Construct URLs for uploaded files
    const fileUrls = {};
    if (req.files.aadhaarFile) {
      fileUrls.aadhaarFile = `/uploads/${req.files.aadhaarFile[0].filename}`;
    }
    if (req.files.panFile) {
      fileUrls.panFile = `/uploads/${req.files.panFile[0].filename}`;
    }
    if (req.files.licenseFile) {
      fileUrls.licenseFile = `/uploads/${req.files.licenseFile[0].filename}`;
    }
    
    res.json({ message: 'Files uploaded successfully', fileUrls });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ message: 'Failed to upload files' });
  }
});

export default router;
