const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

// Serve static assets
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));
// app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
