const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    refreshTokens: {
        type: [{
            token: String,
            source: String,
        }, ],
        default: [],
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    otp: String,
    isActive: Boolean,
});

module.exports = User = mongoose.model('user', UserSchema);