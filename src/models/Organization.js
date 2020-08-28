
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        default: null
    },
    addresses: {
        type: [String],
        default: null
    }
});

module.exports = mongoose.model('Organization', schema);