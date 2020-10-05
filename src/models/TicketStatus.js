
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String
    },
    appearance: {
        type: String
    }
});

module.exports = mongoose.model('TicketStatus', schema);