
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusEnum = [
    "proposed",
    "approved",
    "partialApproved",
    "ordered",
    "partialOrdered",
    "recieved",
    "partialRecieved"
];

const orderItemSchema = Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'InventoryItem'
    },
    quantity: {
        type: Number
    },
    source: {
        type: String
    },
    approved: {
        type: Boolean
    },
    ordered: {
        type: Boolean
    }
});

const schema = Schema({
    number: {
        type: Number
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: statusEnum
    },
    items: {
        type: [orderItemSchema]
    }
});

module.exports = mongoose.model('Order', schema);