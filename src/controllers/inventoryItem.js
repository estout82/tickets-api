
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        inventoryItem.js
 * summary:     controller for inventory item data / objects
 *              - this is mounted on /api/inventory/item
 */

const express = require('express');
const controller = require('../helper/controller');
const { auth } = require('../auth/auth');
const InventoryItem = require('../models/InventoryItem');

let router = express.Router();

/**
 * auth
 */
// router.get('/', auth(['all', 'inv.all', 'inv.item.read']));
// router.get('/:id([0-9a-zA-Z]{24})', auth(['all', 'inv.all', 'inv.item.read']));
// router.post('/create', auth(['all', 'inv.all', 'inv.item.read']));
// router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'inv.all', 'inv.item.read']));
// router.delete('/:id([0-9a-zA-Z]{24})', auth(['all', 'inv.all', 'inv.item.read']));

/**
 * routes
 */
router.get('/', async (req, res, next) => {
    try {
        let queryResult = await InventoryItem.find()
            .select('name category onHand')
            .exec();

        if (queryResult) {
            return res.status(200).json({
                status: 'ok',
                data: queryResult
            });
        }
    } catch (err) {
        return controller.handleQueryError(err, req, res, next);
    }
});

router.get('/:id([0-9a-zA-Z]{24})', 
    controller.createReadHandler(InventoryItem, (id) => {
    return InventoryItem.findById(id)
    .populate('location')
    .exec();
}));

router.post('/create', 
    controller.createCreateHandler(InventoryItem));

router.patch('/:id([0-9a-zA-Z]{24})', 
    controller.createUpdateHandler(InventoryItem));

router.delete('/:id([0-9a-zA-Z]{24})', async (req, res, next) => {
    res.status(400).json({
        status: 'err',
        msg: 'not implemented'
    });
});

module.exports = router;