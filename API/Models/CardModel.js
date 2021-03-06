const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    iban: {
        type: String,
        required: true,
    },
    identity_number: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const card = mongoose.model('Card', CardSchema);

module.exports = card;