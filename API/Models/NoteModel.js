const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true, 
    },
    subject: {
        type: String,
        required: true,
    },
    pageNumber: {
        type: Number,
        required: true,
    },
    purchased: {
        type: Number,
        required: true,
        default: 0,
    },
    notes: {
        type: Array,
        required: false,
        default: [],
    },
    price: {
        type: Number,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    ratingTotal:{
        type: Number,
        required: false,
        default: 0
    },
    ratingCount:{
        type: Number,
        required: false,
        default: 0
    },
    averageRating: {
        type: Number,
        required: false,
        default: 0
    }
}, {
    timestamps: true,
});

const note = mongoose.model('Note', NoteSchema);

module.exports = note;