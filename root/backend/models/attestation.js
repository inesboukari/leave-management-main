const mongoose = require('mongoose');

const attestationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    matricule: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    attestationTravail: {//Ce champ de type booléen indique si une attestation de travail est requise ou non
        type: Boolean,
        required: true
    },
    attestationSalaire: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Attestation', attestationSchema);
