
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = Schema({
    metaCategory: {
        type: String
    }
}, { strict: false });

module.exports = mongoose.model('Meta', schema);