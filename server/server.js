const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(clerkMiddleware()); // must be before all routes
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://aiinterviewpreperation.vercel.app',
    process.env.CLIENT_URL, // fallback for any other frontend URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true
}));
app.use(express.json());

// Database Connection
let isMockMode = false;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        console.log('⚠️  Switching to MOCK MODE (In-Memory Data) ⚠️');
        isMockMode = true;
    });

// Middleware to inject mock mode status
app.use((req, res, next) => {
    req.isMockMode = isMockMode;
    next();
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
// const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/questions', questionRoutes);
app.use('/api/upload', require('./routes/upload'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/resume', require('./routes/resumes'));
app.use('/api/interview', require('./routes/interview'));

// Serve static assets
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));
// app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
