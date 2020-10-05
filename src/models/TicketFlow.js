
const mongoose = require('mongoose');

const operationSchema = mongoose.Schema({
    name: {
        type: String
    },
    params: {
        type: Object
    }
});

const schema = mongoose.Schema({
    name: {
        type: String
    },
    operations: {
        type: [Object]
    }
});

module.exports = mongoose.model('TicketFlow', schema);