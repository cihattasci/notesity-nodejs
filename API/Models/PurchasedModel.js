const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchasedSchema = new Schema({
    purchasedPersonId: {
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
    isEvaluated: {
        type: Boolean,
        default: false,
    }
});

const purchased = mongoose.model('Purchased', PurchasedSchema);

module.exports = purchased;