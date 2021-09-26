const mongoose = require('mongoose')

const extraClassSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
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
    timeFrom: {
        type: Date,
        required: true
    },
    timeTo: {
        type: Date,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        required: true
    }
})

mongoose.model("Class", classSchema)