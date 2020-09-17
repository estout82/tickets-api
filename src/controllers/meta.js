
const express = require('express');
const metaHelper = require('../helper/meta');
const Meta = require('../models/Meta');

let router = express.Router();

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

    res.status(200).json({
        msg: 'it worked?'
    });
});

module.exports = router;