
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    }
});

module.exports = mongoose.model('File', schema);