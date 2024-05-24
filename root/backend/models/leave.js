const mongoose = require('mongoose')

const Schema = mongoose.Schema;



/*Ce schéma définit la structure des documents 
dans la collection MongoDB qui stocke les informations sur les types de congés */

const leaveSchema = new Schema({
    //le nom du type de congé
    name: {
        type: String,
        required: true
    },
    //type de congé exemple Annual
    type: {
        type: String,
        required: true
    },
    //droit au congé
    entitlement:{
        type: Number
    },
    pending: {
        type: Number,
        required: true
    },
    /*"used" se réfère aux jours de congé que l'employé a déjà pris pendant une période donnée */
    used: {
        type: Number,
        required: true
    },
    /*"rollover" peut signifier le report des jours de congé non utilisés d'une année à l'autre */
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