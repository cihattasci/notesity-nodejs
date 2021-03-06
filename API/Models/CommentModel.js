const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    noteId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: false,
    },
    rating: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
}); 

const comment = mongoose.model('Comment', CommentSchema);

module.exports = comment;