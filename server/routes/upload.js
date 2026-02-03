const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Strategy
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique string: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    // Accept images and documents
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf|doc|docx)$/i)) {
        return cb(new Error('Only image and document files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST api/upload
// @desc    Upload an image
// @access  Public (or Private if needed, usually Private but keeping simple for now)
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Log file details for debugging
        console.log('📁 File uploaded successfully:');
        console.log('   - Original name:', req.file.originalname);
        console.log('   - Saved as:', req.file.filename);
        console.log('   - Full path:', req.file.path);
        console.log('   - Size:', (req.file.size / 1024).toFixed(2), 'KB');

        // Return browser-accessible path
        const filePath = `/uploads/${req.file.filename}`;

        res.json({
            msg: 'File uploaded successfully',
            filePath: filePath
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
