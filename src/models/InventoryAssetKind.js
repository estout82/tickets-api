
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = Schema({
    name: {
        type: String
    },
    customId: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    properties: {
        type: [ { name: String } ]
    }
});

module.exports = mongoose.model('InventoryAssetKind', schema);