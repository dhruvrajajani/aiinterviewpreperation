// Quick diagnostic script to test if upload route is registered
const express = require('express');
const app = express();

// Try to load the upload route
try {
    const uploadRoute = require('./routes/upload');
    app.use('/api/upload', uploadRoute);
    console.log('✓ Upload route loaded successfully');

    // Start test server
    const server = app.listen(5001, () => {
        console.log('✓ Test server running on port 5001');
        console.log('Test the upload endpoint with:');
        console.log('  curl -X POST http://localhost:5001/api/upload');

        // Auto-close after 30 seconds
        setTimeout(() => {
            server.close();
            console.log('Test server closed');
            process.exit(0);
        }, 30000);
    });
} catch (error) {
    console.error('✗ Error loading upload route:', error.message);
    process.exit(1);
}
