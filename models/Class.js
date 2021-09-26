const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    periods: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Period',
        default: []
    }],
    link: {
        type: String,
        required: true,
        unique: true
    },
    linkStatus: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Active'
    },
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String
    },
    department: {
        type: String
    },
    year: {
        type: String
    },
    section: {
        type: String
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    createdAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Class', classSchema)
