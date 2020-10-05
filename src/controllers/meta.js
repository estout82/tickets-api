
const express = require('express');
const metaHelper = require('../helper/meta');
const Meta = require('../models/Meta');
const log = require('../helper/log');
const controller = require('../helper/controller');

let router = express.Router();

/**
 * gets ALL metadata
 */
router.get('/', controller.createReadAllHandler(Meta));

/**
 * gets ALL ticket metadata
 */
router.get('/ticket', async (req, res, next) => {
    // ensure meta collection has been initalized
    let metaInitalizeResult = await metaHelper.ensureMetaCollectionInitalized();

    // check if initalize sucess
    if (metaInitalizeResult !== true) {

        // forward request to error middleware
        next({
            status: 'database error',
            msg: 'unable to verify meta collection has been initalized'
        });
        
        return;
    }

    // query for ticket metadata
    try {
        let document = await Meta.findOne({ metaCategory: 'ticket' })
            .select('categories statuses formDefinitions flowDefinitions')
            .exec();

        res.status(200).json({
            status: 'ok',
            data: {
                ...document._doc
            }
        });

        return;
    } catch (error) {
        log.error('failed to retrive ticket metadata document', 0, error);

        next({
            status: 'database error',
            msg: 'failed to retrieve ticket metadata document from meta collection'
        });

        return;
    }
});

/**
 * get ALL order metadata
 */
router.get('/order', async (req, res, next) => {
    let metaCollectionInitalizeResult = await metaHelper.ensureMetaCollectionInitalized();

    // check if initalize sucess
    if (metaCollectionInitalizeResult !== true) {

        // forward request to error middleware
        next({
            status: 'database error',
            msg: 'unable to verify meta collection has been initalized'
        });
        
        return;
    }

    try {
        let document = await Meta.findOne({ metaCategory: 'order' })
            .select('categories statuses nextOrderNumber')
            .exec();

        res.status(200).json({
            status: 'ok',
            data: {
                ...document._doc
            }
        });

        return;
    } catch (error) {
        log.error('failed to retrive order metadata document', 0, error);

        next({
            status: 'database error',
            msg: 'failed to retrieve order metadata document from meta collection'
        });

        return;
    }
});

module.exports = router;