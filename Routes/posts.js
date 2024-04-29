const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const post = require('./Models/postSchema');
const cloudinary = require('cloudinary').v2;


router.post('/createNewPost/:userID', (req, res, next) => {
    const postImage = req.files.postPic;
    cloudinary.uploader.upload(postImage.tempFilePath, (error, result) => {
        if (error) {
            return res.status(500).json({
                message: "Try changing the image."
            })
        }
        const N_post = new post({
            _id: new mongoose.Types.ObjectId,
            userID: req.params.userID,
            postImageUrl: result.url,
            imageTile: req.body.imageTile,
            imageDescription: req.body.imageDescription
        })

        N_post.save()
            .then(result => {
                res.status(200).json({
                    message: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: err
                })
                console.log(err);
            })
    })

})


router.get('/', (req, res, next) => {
    post.find()
        .then(result => {
            post.aggregate([{ $sample: { size: result.length } }])
                .then(result => {
                    res.status(200).json({
                        message: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: err
                    })
                })
        })
        .catch(err => {
            console.log(err);
        })
})


router.get('/:userId', (req, res, next) => {
    post.find({ 'userID': req.params.userId })
        .then(result => {
            res.status(200).json({
                message: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
})

router.delete('/delete/', (req, res, next) => {
    const imageName = req.query.imageName;

    post.deleteOne({ _id: req.query.imageId })
        .then(result => {
            res.status(200).json({
                message: result
            })
            cloudinary.uploader.destroy(imageName, (error, result) => {
                console.log(error, result);
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
})


module.exports = router;