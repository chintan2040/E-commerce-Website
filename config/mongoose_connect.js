const mongoose = require('mongoose');
const debug= require("debug")("development:mongoose");
const config = require('config');
require('dotenv').config(); // Add this at the top

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

module.exports = mongoose.connection;