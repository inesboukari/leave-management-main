const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    entitlement:{
        type: Number
    },
    pending: {
        type: Number,
        required: true
    },
    used: {
        type: Number,
        required: true
    },
    rollover: {
        type: Boolean
    },
    note: {
        type: String,
        required: true
    },
    year: {
        type: Number
    },
    addedByUser: {
        type: Boolean
    }
   
})

module.exports = mongoose.model('Leave', leaveSchema)