
const express = require('express');
const controller = require('../helper/controller');
const Order = require('../models/Order');

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
        .populate('items.id', 'name')
        .exec();
}

router.get('/:id([0-9a-zA-Z]{24})', 
    controller.createReadHandler(Order, readQueryCallback));

/**
 * responds with shallow data about a single page of orders
 */
router.get('/page/:number([0-9]+)', controller.createReadPageHandler(Order, 25));

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

router.post('/create', controller.createCreateHandler(Order));

router.patch('/:id([0-9a-zA-Z]{24})', controller.createUpdateHandler(Order));

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

router.post('/search', async (req, res, next) => {
    res.json({
        status: 'err',
        msg: 'search not implemented'
    });
});

module.exports = router;