const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const leaveEntitlementSchema = new Schema({
    leaveEntitlement: {
        type: Array,
        required: true
    },
    entity: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('LeaveEntitlement', leaveEntitlementSchema)