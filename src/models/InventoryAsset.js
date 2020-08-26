
const mongoose = require('mongoose');
const { validateId } = require('../helper/validate');
const InventoryAssetKind = require('./InventoryAssetKind');
const InventoryLocation = require('./InventoryLocation');

const Schema = mongoose.Schema;

const schema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    kind: {
        type: Schema.Types.ObjectId,
        ref: InventoryAssetKind,
        validate: {
            validator: async value => await validateId(InventoryAssetKind, value),
            message: props => `${props.value} is not an inventory asset kind id`
        }
    },
    customId: {
        type: String
    },
    isRefurbished: {
        type: Boolean
    },
    location: {
        type: Schema.Types.ObjectId,
        validate: {
            validator: async value => await validateId(InventoryLocation, value),
            message: props => `${props.value} is not a inventory location id`
        }
    },
    properties: {
        type: [{ key: String, value: Object }],
        validate: {
            validator: async value => {
                // TODO: check required properties based on kind...
                return true;
            },
            message: props => `${props.value} properties are not valid`
        }
    }
});

module.exports = mongoose.model('InventoryAsset', schema);