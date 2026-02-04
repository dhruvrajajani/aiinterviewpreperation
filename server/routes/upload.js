const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage for multer (no local files)
const storage = multer.memoryStorage();

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
// @desc    Upload a file to Cloudinary
// @access  Public
router.post('/', (req, res) => {
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error('❌ Multer Error:', err.message);
            return res.status(400).json({ msg: 'Upload error: ' + err.message });
        }

        try {
            if (!req.file) {
                console.log('❌ No file received in request');
                return res.status(400).json({ msg: 'No file uploaded' });
            }

            console.log('📤 Uploading to Cloudinary:', req.file.originalname);
            console.log('📄 File type:', req.file.mimetype);

            // Determine resource type based on mimetype
            const isImage = req.file.mimetype.startsWith('image/');
            const resourceType = isImage ? 'image' : 'raw';

            // Extract file extension from original filename
            const fileExtension = path.extname(req.file.originalname);

            console.log('📦 Resource type:', resourceType);
            console.log('📎 Extension:', fileExtension);

            // Convert buffer to base64 for Cloudinary upload
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'interviewprep',
                resource_type: resourceType,
                public_id: `${req.file.fieldname}-${Date.now()}`,
                format: fileExtension.replace('.', '') || (isImage ? 'jpg' : 'pdf')
            });

            console.log('✅ Cloudinary upload success!');
            console.log('   - URL:', result.secure_url);
            console.log('   - Public ID:', result.public_id);

            // Return the Cloudinary URL
            res.json({
                msg: 'File uploaded successfully',
                filePath: result.secure_url
            });
        } catch (error) {
            console.error('❌ Cloudinary upload error:', error);
            res.status(500).json({ msg: 'Upload failed: ' + error.message });
        }
    });
});

module.exports = router;
