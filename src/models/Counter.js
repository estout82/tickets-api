
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    modelName: {
        type: String
    },
    count: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Counter', schema);