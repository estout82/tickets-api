
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
const InventoryAsset = require('../models/InventoryAsset');

let router = express.Router();

/**
 * auth
 */
// router.get('/', auth(['all', 'inv.all', 'inv.asset.read']));
// router.get('/:id([0-9a-zA-Z]{24})', auth(['all', 'inv.all', 'inv.asset.read']));
// router.post('/create', auth(['all', 'inv.all', 'inv.asset.read']));
// router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'inv.all', 'inv.asset.read']));
// router.delete('/:id([0-9a-zA-Z]{24})', auth(['all', 'inv.all', 'inv.asset.read']));

/**
 * routes
 */
router.get('/', async (req, res, next) => {
    res.status(400).json({
        status: 'err',
        msg: 'not implemented'
    });
});

router.get('/:id([0-9a-zA-Z]{24})', 
    controller.createReadHandler(InventoryAsset, (id) => {
    return InventoryAsset.findById(id)
    .populate('kind')
    .exec();
}));

router.post('/create',
    controller.createCreateHandler(InventoryAsset));

router.patch('/:id([0-9a-zA-Z]{24})', async (req, res, next) => {
    res.status(400).json({
        status: 'err',
        msg: 'not implemented'
    });
});

router.delete('/:id([0-9a-zA-Z]{24})', async (req, res, next) => {
    res.status(400).json({
        status: 'err',
        msg: 'not implemented'
    });
});

module.exports = router;