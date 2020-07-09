
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        inventoryAssignment.js
 * summary:     controller for inventory location data / objects
 *              - this is mounted on /api/inventory/assignment
 */

// TODO: make a route to create a new assignment be smart
//      - asset vs item
//      - multiple of each
//      - do based on name or id or upc

const express = require('express');
const mongoose = require('mongoose');
const {
    handleQueryError,
    handleValidateError,
    handleSaveError,
    handleEmptyRequest,
    handleNotImplemented
} = require('../helper/controller');
const InventoryAssignment = require('../models/InventoryAssignment');
const InventoryItem = require('../models/InventoryItem');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let data = await InventoryAssignment.find();

        res.status(200).json({
            status: 'ok',
            data: data
        });
    } catch (err) {
        handleQueryError(err, req, res, next);
    }
});

router.get('/:id([0-9a-zA-Z]{24})', handleNotImplemented);

// modify request body so all names of items / assets are converted to ids
// sends an error response if name does not resolve to an id
// TODO: possibly refactor to remove code duplication
const convertNamesToIds = async (req, res, next) => {
    // loop through all items and resolve names to ids
    if (req.body.items) {
        req.body.items.forEach(async item => {
            // if name was givin, convert to id
            if (item.name) {
                // search by name in db
                try {
                    let queryResult = await InventoryItem
                    .findOne({ name: item.name })
                    .select('_id')
                    .exec();

                    if (queryResult) {
                        // modify body to include id instead of name
                        req.body.items[item.name].itemId = queryResult._id;
                        delete req.body[item.name].name; 
                    } else {
                        // not found, send error response
                        res.status(400);
                        next({
                            status: 'request err',
                            msg: `${item.name} is found in db`
                        });
                        return false;
                    }
                } catch (err) {
                    handleQueryError(err, req, res, next);
                    return false;
                }
            }
        })
    }

    // loop through all assets and resolve names to ids
    if (req.body.assets) {
        req.body.assets.forEach(async asset => {
            // if name was givin, convert to id
            if (asset.name) {
                // search by name in db
                try {
                    let queryResult = await Inventoryasset
                    .findOne({ name: asset.name })
                    .select('_id')
                    .exec();

                    if (queryResult) {
                        // modify body to include id instead of name
                        req.body.assets[asset.name].assetId = queryResult._id;
                        delete req.body[asset.name].name; 
                    } else {
                        // not found, send error response
                        res.status(400);
                        next({
                            status: 'request err',
                            msg: `${asset.name} is found in db`
                        });
                        return false;
                    }
                } catch (err) {
                    handleQueryError(err, req, res, next);
                    return false;
                }
            }
        })
    }
}

router.post('/create', async (req, res, next) => {
    // make sure body is not null
    if (!req.body) {
        handleEmptyRequest(req, res, next);
    }

    // convert names in body to ids and return if fail
    if (convertNamesToIds(req, res, next) == false) return;

    // create a new doc
    let doc = new InventoryAssignment(req.body);

    // validate doc
    try {
        let validateResult = await doc.validate();
    } catch (err) {
        return handleValidateError(err, req, res, next);
    }

    try {
        let queryResult = await doc.save();

        return res.status(201).json({
            status: 'ok',
            msg: 'created',
            data: queryResult._id
        });
    } catch (err) {
        return handleSaveError(err, req, res, next);
    }
});

router.patch('/:id([0-9a-zA-Z]{24})', handleNotImplemented);

router.delete('/:id([0-9a-zA-Z]{24})', handleNotImplemented);

module.exports = router;