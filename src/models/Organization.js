
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        default: null,
        unique: true
    },
    addresses: {
        type: [String],
        default: null
    }
});

module.exports = mongoose.model('Organization', organizationSchema);