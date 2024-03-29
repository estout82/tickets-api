
const mongoose = require('mongoose');
const { validateId } = require('../helper/validate');
const InventoryLocation = require('../models/InventoryLocation');

const Schema = mongoose.Schema;

// TODO: add a seperate collection for categories?
// TODO: add a seperate collection for roles?

const schema = Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    description: {
        type: String
    },
    manufacture: {
        type: String,
        default: null
    },
    upc: {
        type: String,
        match: [/[0-9]{12}/, 'upc is not a 12 digit number'],
        default: null
    },
    category: {
        type: String,
        default: null
    },
    role:  {
        type: String,
        default: null
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'InventoryLocation',
        validate: {
            validator: async (value) => {
                return await validateId(InventoryLocation, value);
            },
            message: props => `${props.value} is not a valid inventory location id`
        },
        default: null
    },
    customId: {
        type: String
    },
    source: {
        type: {
            url: String,
            vendor: {
                type: String,
                enum: ['amazon', 'apple', 'tiger direct']
            }
        }
    },
    price: {
        type: Number,
        default: null
    },
    newOnHand: {
        type: Number,
        default: 0
    },
    refurbishedOnHand: {
        type: Number,
        default: 0
    },
    idealOnHand: {
        type: Number,
        default: 0
    },
    lastDateIssued: {
        type: Date,
        default: null
    },
    displayInStore: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('InventoryItem', schema);