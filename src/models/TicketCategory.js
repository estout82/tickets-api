
const mongoose = require('mongoose');
const validate = require('../helper/validate');

const Schema = mongoose.Schema;

const ticketCategorySchema = Schema({
    name: {
        type: String,
        default: null,
        unique: [true, props => `${props.value} is not a unique ticket category name`],
        required: true
    },
    description: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('TicketCategory', ticketCategorySchema);