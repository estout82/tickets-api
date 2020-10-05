
const mongoose = require('mongoose');

const fieldSchema = mongoose.Schema({
    // name of the field used by system
    name: {
        type: String
    },

    // label that is displayed in form
    label: {
        type: String
    },

    // string specifing type of form element to present
    element: {
        type: String
    }
});

const schema = mongoose.Schema({
    fields: {
        type: [fieldSchema]
    }
});

module.exports = mongoose.model('TicketForm', schema);