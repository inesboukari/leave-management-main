const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isAdmin: {
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
    createdOn: {
        type: String,
        required: true
    },
    lastUpdatedOn: {
        type: String,
        required: true
    },
    // ro: {
    //     type: String,
    //     required: true
    // },
    reportingEmail: {
        type: String,
        required: true
    },
    // co: {
    //     type: String,
    //     required: true
    // },
    coveringEmail: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    sessionToken: String,
    sessionTokenExpiration: Date,
    leave: {
        type: Object,
        required: true
    },
    leaveHistory: {
        type: Object,
        required: true
    },
    staffLeave: Object
})

module.exports = mongoose.model('User', userSchema)