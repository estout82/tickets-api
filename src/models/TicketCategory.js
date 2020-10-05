
const mongoose = require('mongoose');
const validate = require('../helper/validate');

const Schema = mongoose.Schema;

const schema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    form: {
        type: Schema.Types.ObjectId,
        ref: 'TicketForm'
    },
    flows: {
        type: [Schema.Types.ObjectId],
        ref: 'TicketFlow'
    }
});

module.exports = mongoose.model('TicketCategory', schema);