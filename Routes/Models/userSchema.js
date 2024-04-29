const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userDP_url: String,
    userName: String,
    userEmail: String,
    userPassword: String,
    userDescription: String,
    userType: String
});

module.exports = mongoose.model('user' , userSchema);