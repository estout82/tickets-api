
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = Schema({
    name: {
        type: String,
        required: true
    },
    permissions: {
        type: [String],
        default: null
    }
});

module.exports = mongoose.model('UserRole', schema);