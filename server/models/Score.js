const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true
    },

    score: {
        type:Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Score",scoreSchema);