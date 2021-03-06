const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    totalProfit: {
        type: Number,
        required: false,
        default: 0
    },
    totalSell: {
        type: Number,
        required: false,
        default: 0
    },
    totalBuy: {
        type: Number,
        required: false,
        default: 0
    },
    token: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpirations: Date,
}, {
    timestamps: true,
});

const user = mongoose.model('User', UserSchema);

module.exports = user;