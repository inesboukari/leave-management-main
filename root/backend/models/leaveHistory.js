const mongoose = require('mongoose')

const Schema = mongoose.Schema;
/*Ce schéma définit la structure des documents dans la collection MongoDB qui stocke l'historique des demandes de congé*/ 

const leaveHistorySchema = new Schema({
    leaveType: {
        type: String,
        required: true
    },
    timePeriod: {
        type: String,
        required: true
    },
    staffName:{
        type: String,
        required: true
    },
    startDate:{
        type: String,
        required: true
    },
    endDate:{
        type: String,
        required:true
    },
    timestamp:{
        type: Date,
        default: Date.now
    },
    numOfDaysTaken: {
        type: String,
        required: true
    },
    submittedOn: {
        type: String,
        required: true
    },
    quotaUsed: {
        type: Number,
        required: true
    },
    coveringEmail: {
        type: String,
        required: true
    },
    reportingEmail: {
        type: String,
        required: true
    },
    leaveClassification: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required:true
    }
})

module.exports = mongoose.model('LeaveHistory', leaveHistorySchema)