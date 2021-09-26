const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    confirmationCode: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
    },
    classCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        default: []
    }],
    classJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        default: []
    }],
    createdAt: {
        type: Date,
    },
})

module.exports = mongoose.model('User', userSchema)
