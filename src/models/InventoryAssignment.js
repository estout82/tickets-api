
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        inventoryAssignment.js
 * summary:     model represents an event where inventory (items and assets) are assigned to a user
 */

 /**
  * schema
  * 
  * items: array of ids corresponding to items assigned
  *  - itemId: id of corresonding item
  *  - isLoaner: is item loaner
  *  - isCharged: is item charged? (seperate from refurbished)
  * assets: array of ids correponding to assets assigned
  *  - assetId: id of corresonding asset
  *  - isLoaner: is asset loaner
  *  - isCharged: is asset charged? (seperate from refurbished)
  * user: id of user issued to
  * dateIssued: datetime of issue
  * 
  */

const mongoose = require('mongoose');
const { validateId } = require('../helper/validate');
const User = require('../models/User');
const InventoryItem = require('../models/InventoryItem');
const InventoryAsset = require('../models/InventoryAsset');

const Schema = mongoose.Schema;

const inventoryAssignmentSchema = Schema({
    items: {
        type: [{
            itemId: {
                type: Schema.Types.ObjectId,
                required: true,
                validate: {
                    validator: async value => await validateId(InventoryItem, value),
                    message: props => `${props.value} is not an item id`
                }
            },
            isLoaner: {
                type: Boolean,
                default: false
            },
            isCharged: {
                type: Boolean,
                default: true
            }
        }],
        default: null
    },
    assets: {
        type: [{
            assetId: {
                type: Schema.Types.ObjectId,
                required: true,
                validate: {
                    validator: async value => await validateId(InventoryAsset, value),
                    message: props => `${props.value} is not an asset id`
                }
            },
            isLoaner: {
                type: Boolean,
                default: false
            },
            isCharged: {
                type: Boolean,
                default: true
            }
        }],
        default: null
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: async (value) => validateId(User, value),
            message: props => `${props.value} is not a user id`
        }
    },
    // TODO: make this a virtual
    totalPrice: {
        type: Number
    },
    issuedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('InventoryAssignment', inventoryAssignmentSchema);