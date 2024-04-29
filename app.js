const express = require('express');
const app = express();
const user = require('./Routes/user');
const posts = require('./Routes/posts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
          
cloudinary.config({ 
  cloud_name: 'djkufp9s1', 
  api_key: '174572555582571', 
  api_secret: 'QI74kpK0jpyEJ-Uh39vsJAxW6x8' 
});

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ehsanali3669:12345@sbs.c9rzace.mongodb.net/');
mongoose.connection.on('connected' , connection => {
    console.log('connection success');
})
mongoose.connection.on('error' , err => {
    console.log(err);
})

app.use(fileUpload({
    useTempFiles: true
}));

app.use('/user' , user);
app.use('/posts' , posts);


// bad request
app.use((req,res,next) => {
    res.status(404).json({
        message: "page not found"
    })
})


module.exports = app;