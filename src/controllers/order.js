
const express = require('express');
const controller = require('../helper/controller');
const Order = require('../models/Order');
const debug = require('../helper/debug');

/**
 * constants ----------------------------------------------------------------------
 */
const numOrdersPerPage = 25;

// TODO: make this dynamic
const orderCategories = ['restock', 'designated', 'other'];

// TODO: make this dynamic
const orderStatues = ['proposed', 'approved', 'ordered', 'recieved'];

let router = express.Router();

/**
 * routes -------------------------------------------------------------------------
 */

/**
 * responds with shallow data of ALL orders
 */
const readAllQueryCallback = async () => {
    return Order.find()
        .select('number category status')
        .exec();
}

router.get('/', 
    controller.createReadAllHandler(Order, readAllQueryCallback));

/**
 * responds with all data about a single order
 */
const readQueryCallback = async (id) => {
    return Order.findById(id)
        .populate('items.item', 'name')
        .exec();
}

router.get('/:id([0-9a-zA-Z]{24})', 
    controller.createReadHandler(Order, readQueryCallback));

/**
 * responds with shallow data about a single page of orders
 */
router.get('/page/:number([0-9]+)', 
    controller.createReadPageHandler(Order, numOrdersPerPage));

/**
 * this route responds with various meta data about the order data
 * numOrders        - total number or orders in the db
 * numOrderPages    - total number of pages of orders
 * categories       - Array w/ all order categories
 * statuses         - Array w/ all possible statuses
 */
router.get('/meta', async (req, res, next) => {
    // TODO: error handling
    const numOrders = await Order.countDocuments();

    res.send({
        status: 'ok',
        data: {
            numOrders: numOrders,
            numOrderPages: Math.ceil(numOrders / numOrdersPerPage),
            categories: orderCategories,
            orderStatuses: orderStatues
        }
    });
});

router.post('/create', 
    controller.createCreateHandler(Order));

router.patch('/:id([0-9a-zA-Z]{24})', 
    controller.createUpdateHandler(Order));

router.get('/reservePoNumber', async (req, res, next) => {
    res.json({
        status: 'err',
        msg: 'reservePoNumber not implemented'
    });
});

router.post('/releasePoNumber/:number([0-9]+)', async (req, res, next) => {
    res.json({
        status: 'err',
        msg: 'releasePoNumber not implemented'
    });
});

/**
 * responds with all data of an order with specific search
 * reqBody:
 *  - number: number or order to search
 */
router.post('/search', async (req, res, next) => {
    let orderNumber = null;

    // get the order number from req body
    if (req.body && req.body.number) {
        orderNumber = req.body.number;
    } else {
        res.status(400).json({
            status: 'error',
            msg: 'order number missing from request body'
        });
        return;
    }

    try {
        let searchResult = await Order.findOne({ number: orderNumber })
            .populate('items.item', 'name')
            .exec();

        if (searchResult) {
            res.status(200).json({
                status: 'ok',
                data: searchResult
            });
            return;
        } else {
            res.status(200).json({
                status: 'ok',
                msg: `no order with number ${orderNumber}`
            });
            return;
        }
    } catch (error) {
        console.dir(error);
        res.status(500).json({
            status: 'error',
            msg: 'query error during search query',
            debug: debug.replace(error)
        });
        return;
    }
});

module.exports = router;