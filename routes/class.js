const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('./../models/User')
const Class = require('./../models/Class')
const ensureAuth = require('./../middleware/requireLoginJwt')
const { v4: uuidv4 } = require('uuid');

//create a new class
router.post('/new-class', ensureAuth, async (req, res) => {
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
            link: uuidv4(),
            createdAt: Date.now()
        })

        newClass.save((err) => {
            if (err) {
                return res.status(404).json({ message: 'Error Occured', err })
            }
            return res.status(200).json({ message: "Class created Successfully" })
        })

    } catch (err) {
        return res.status(404).json({ message: 'Error Occured', err })
    }

})

//get joined and created class
router.get('/get-class', ensureAuth, async (req, res) => {
    try {
        let classesJoined = []
        const userSearch = await User.findById(req.user._id).populate('classJoined')

        userSearch.classJoined.forEach((e)=>{
            classesJoined.push(e);
        })

        const classCreated = await Class.find({createdBy: req.user._id})

        let allClasses = classesJoined.concat(classCreated)
        
        return res.json(allClasses)
        
    } catch (err) {
        return res.status(404).json({ message: 'Error Occured', err })
    }
})

//edit a particular class with its id
router.put('/edit-class/:id', ensureAuth, async (req, res) => {
    try {
        const { id } = req.params

        const editedClass = await Class.findByIdAndUpdate({ _id: id }, req.body, { new: true });

        if (!editedClass) res.status(401).json({ message: 'Post data invalid' })

        return res.status(200).json({ message: 'Class Updated', editedClass })

    } catch (err) {

        return res.status(404).json({ message: 'Error Occured', err })
    }

})

//join a class
router.get('/join-class/:link', ensureAuth, async (req, res) => {
    try {
        const { link } = req.params
        const searchClass = await Class.findOne({ link });

        if (!searchClass) {
            return res.json({ message: 'Class not found!' })
        }

        if (searchClass.linkStatus === "Inactive") {
            return res.json({ message: 'Class status is inactive' })
        }

        //If the user is already joined
        searchClass.students.forEach((s)=>{
            if(JSON.stringify(s) === JSON.stringify(req.user._id)){
                return res.json({message : 'The user is already joined to the class'})
            }
        })

        searchClass.students.push(req.user._id)

        searchClass.save((err) => {
            if (err) {
                return res.status(404).json({ message: 'Error Occured', err })
            }
            req.user.classJoined.push(searchClass._id)
            req.user.save((err) => {
                if (err) {
                    return res.status(404).json({ message: 'Error Occured', err })
                }
            })
            return res.status(200).json({ message: "Class joined Successfully" })
        })

    } catch (err) {
        return res.status(404).json({ message: 'Error Occured', err })
    }
})

//change class link status
router.post('/change-status/:link', ensureAuth, async (req, res) => {
    try {
        const { link } = req.params
        const { linkStatus } = req.body

        const searchClass = await Class.findOne({ link });

        if (!searchClass) {
            return res.json({ message: 'Class not found!' })
        }

        if (linkStatus !== 'Inactive' || linkStatus !== 'Active') {
            return res.json({ message: 'Invalid input of linkStatus' })
        }

        searchClass.linkStatus = linkStatus;

        searchClass.save((err) => {
            if (err) {
                return res.status(404).json({ message: 'Error Occured', err })
            }
            return res.status(200).json({ message: "Class linkStatus changed Successfully" })
        })


    } catch (err) {
        return res.status(404).json({ message: 'Error Occured', err })
    }
})

module.exports = router

