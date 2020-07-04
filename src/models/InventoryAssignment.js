
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventoryAssignmentSchema = Schema({
    items: {
        type: [{
            item: Schema.Types.ObjectId,
            isLoaner: Boolean
        }]
    },
    client: {
        type: Schema.Types.ObjectId
    },
    totalPrice: {
        type: Number
    },
    issuedAt: {
        type: Date
    }
});

module.exports = mongoose.model('InventoryAssignment', inventoryAssignmentSchema);