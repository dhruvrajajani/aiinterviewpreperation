const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('Attempting to connect to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully Connected!');
        process.exit();
    })
    .catch(err => {
        console.error('Connection Failed:', err.message);
        process.exit(1);
    });
