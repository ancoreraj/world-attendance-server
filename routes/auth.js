const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('./../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const ensureAuth = require('./../middleware/requireLoginJwt')
const { v4: uuidv4 } = require('uuid');
const sendConfirmationEmail = require('./../middleware/nodemailer/accountConfirmationMail')

router.get('/protected', ensureAuth, (req, res) => {
    res.send('Hello world')
})

router.post('/register', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const confirmationCode = uuidv4()
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        confirmationCode
                    })

                    sendConfirmationEmail(name, email, confirmationCode);

                    user.save()
                        .then(user => {
                            res.json({ message: "Verification Email is sent to your email id.", user })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or password" })
            }

            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {

                        if(savedUser.status === 'Pending'){
                            return res.status(422).json({message: 'User is registered but not Verified'})
                        }

                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        res.json({ message:"User successfully signin", token, user: savedUser })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

router.get('/confirmAccount/:confirmationCode', (req, res) => {
    User.findOne({
        confirmationCode: req.params.confirmationCode,
    }).then((user) => {
        if (!user) {
            return res.json({ message: "Wrong Confirmation code" })
        }
        user.status = "Active";
        user.save((err) => {
            if (err) {
                console.log(err)
            } else {
                res.json({ message: "Congratulations, You have been successfully registered." })
            }
        })
    })
})

module.exports = router