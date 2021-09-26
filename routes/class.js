const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('./../models/User')
const Class = require('./../models/Class')
const ensureAuth = require('./../middleware/requireLoginJwt')

//create a new class
router.post('/create-class', ensureAuth, async (req, res) => {
    try {
        const { name, subject, department, year, section } = req.body

        if (!name) {
            return res.json({ message: "Name Input is undefined" })
        }

        const newClass = new Class({
            createdBy: req.user._id,
            name,
            subject,
            department,
            year,
            section,
            createdAt: Date.now()
        })

        newClass.save((err) => {
            if (err) {
                return res.status(404).json({ message: 'Error Occured' })
            }

            return res.status(200).json({ message: "Class created Successfully" })
        })

    } catch (err) {
        return res.status(404).json({ message: 'Error Occured' })
    }

})

module.exports = router

