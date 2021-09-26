const mongoose = require('mongoose')
const { stringify } = require('uuid')

const periodSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class',
    },
    timeFrom: {
        type: Date,
        required: true
    },
    timeTo: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
    }
})

mongoose.model("Class", classSchema)