const mongoose = require('mongoose')

const Schema = mongoose.Schema;
//pour stocker les droits aux congés dans une base de données
/*Il leaveEntitlements s'agit d'un tableau, indiquant les jours de congé ou les types de congés auxquels l'employé a droit. */
/*Il entity s'agit d'une chaîne de caractères, indiquant  l'entité ou l'entreprise à laquelle appartient l'employé. */

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