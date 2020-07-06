
const mongoose = require('mongoose');
const validate = require('../helper/validate');

const Schema = mongoose.Schema;

const inventoryLocationSchema = Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: null
    },
    format: {
        type: {
            grid: [Number, Number],
            shelves: [String]
        },
        default: null
    },
    accessCode: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('InventoryLocation', inventoryLocationSchema);