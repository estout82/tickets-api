
const mongoose = require('mongoose');
const validate = require('../helper/validate');

const schema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('TicketCategory', schema);