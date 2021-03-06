const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    whomId: {
        type: String,
        required: true,
    },
    noteId: {
        type: String,
        required: true,
    },
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
        default: []
    },
    price: {
        type: Number,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    averageRating: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true,
});

const favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = favorite;