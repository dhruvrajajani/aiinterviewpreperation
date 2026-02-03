const fs = require('fs');
const path = require('path');

// Create a dummy file in uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
const testFilePath = path.join(uploadsDir, 'test-file.txt');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
}

// Create a test file
fs.writeFileSync(testFilePath, 'This is a test file to verify uploads folder is working.');
console.log('✅ Test file created at:', testFilePath);

// List all files in uploads
const files = fs.readdirSync(uploadsDir);
console.log('\n📁 Files in uploads folder:', files);
console.log('\n✅ Upload folder is working correctly!');
