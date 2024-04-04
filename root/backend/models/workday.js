const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const workDaySchema = new Schema({
    workday: {
        type: Array,
        required: true
    },
    holiday: {
        type: Array,
        required: true
    },
    entity: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Workday', workDaySchema)