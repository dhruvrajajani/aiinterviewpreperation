const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./models/Question');
mongoose.connect(process.env.MONGO_URI).then(async () => {
   const q = await Question.findOne({category: 'Coding'});
   console.log('Sample question topic is:', q.topic);
   process.exit();
}).catch(err => { console.error(err); process.exit(1); });
