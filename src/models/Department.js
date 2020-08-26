
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        default: null,
        unique: true
    }
});

module.exports = mongoose.model('Department', schema);