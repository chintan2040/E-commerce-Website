const mongoose = require('mongoose');
const debug= require("debug")("development:mongoose");
const config = require('config');

mongoose.connect(`${config.get("MONGODB_URI")}/userdb`)
.then(()=>{

    debug('Connected to MongoDB');
})
.catch((err)=>{
    debug('Error connecting to MongoDB');
    debug(err);
});

module.exports = mongoose.connection;