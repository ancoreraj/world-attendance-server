const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Class = mongoose.model('Class')
const ensureAuth = require('./../middleware/requireLoginJwt')

router.get('/', ensureAuth, (req,res)=>{

})

module.exports = router