
const mongoose = require('mongoose');
const { validateId } = require('../helper/validate');
const User = require('../models/User');

const Schema = mongoose.Schema;

const inventoryAssignmentSchema = Schema({
    items: {
        type: [{
            item: {
                type: Schema.Types.ObjectId,
                required: true,
                validate: {
                    validator: async (value) => validateId(value),
                    message: props => `${props.value} is not a item id`
                }
            },
            isLoaner: Boolean
        }]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: async (value) => validateId(User, value),
            message: props => `${props.value} is not a user id`
        }
    },
    totalPrice: {
        type: Number
    },
    issuedAt: {
        type: Date
    }
});

module.exports = mongoose.model('InventoryAssignment', inventoryAssignmentSchema);