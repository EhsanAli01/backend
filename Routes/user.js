const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const user = require('./Models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;


router.post('/signup', (req, res, next) => {
    user.find({ userEmail: req.body.userEmail })
        .exec()
        .then(usr => {
            if (usr.length >= 1) {
                return res.status(401).json({
                    message: 'Email already exists'
                })
            }
            bcrypt.hash(req.body.userPassword, 10, (error, hash) => {
                if (error) {
                    return res.status(200).json({
                        message: error
                    })
                }

                const userDp = req.files.userPic;
                cloudinary.uploader.upload(userDp.tempFilePath, (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            message: "Try changing the image."
                        })
                    }
                    const data = new user({
                        _id: new mongoose.Types.ObjectId,
                        userDP_url: result.url,
                        userName: req.body.userName,
                        userEmail: req.body.userEmail,
                        userPassword: hash,
                        userDescription: req.body.userDescription,
                        userType: 'user'
                    })

                    data.save()
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
        })
})


router.post('/login', (req, res, next) => {
    user.find({ userEmail: req.body.userEmail })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Email does not found'
                })
            }
            bcrypt.compare(req.body.userPassword, user[0].userPassword, (error, result) => {
                if (!result) {
                    return res.status(401).json({
                        message: 'Incorrect Password'
                    })

                }
                const token = jwt.sign(
                    {
                        _id: user[0]._id,
                        userDP_url: user[0].userDP_url,
                        userName: user[0].userName,
                        userEmail: user[0].userEmail,
                        userDescription: user[0].userDescription,
                        userType: user[0].userType
                    },
                    "This is top secret",
                    {
                        expiresIn: '20h'
                    }
                )
                res.status(200).json({
                    token: token,
                    result: result,
                    data: {
                        _id: user[0]._id,
                        userDP_url: user[0].userDP_url,
                        userName: user[0].userName,
                        userEmail: user[0].userEmail,
                        userPassword: user[0].userPassword,
                        userDescription: user[0].userDescription,
                        userType: user[0].userType
                    }
                })
            })
        })
})

router.get('/partners', (req, res, next) => {
    user.find({ $or: [{ userType: 'partner' }, { userType: 'owner' }] })
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

router.get('/:id', (req, res, next) => {
    user.find({ _id: req.params.id })
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


module.exports = router;