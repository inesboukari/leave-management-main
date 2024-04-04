const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const teamCalendarSchema = new Schema({
    approvedLeave: {
        type: Array,
        required: true
    },
    team: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('TeamCalendar', teamCalendarSchema)