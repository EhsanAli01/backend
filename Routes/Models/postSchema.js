const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    postImageUrl: String,
    imageTile: String,
    imageDescription: String
});

module.exports = mongoose.model('posts' , postSchema);