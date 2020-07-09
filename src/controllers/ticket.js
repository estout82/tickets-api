
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        ticket.js
 * summary:     controller for ticket data / objects
 *              - this is mounted on /api/ticket
 */

const express = require('express');
const controller = require('../helper/controller');
const Ticket = require('../models/Ticket');

const router = express.Router();

const readAllQueryCallback = async () => {
    return Ticket
    .find()
    .select('title category organization user')
    .populate([
        { path: 'user', select: 'firstName lastName email' },
        { path: 'organization', select: 'name' },
        { path: 'category', select: 'name' }
    ])
    .exec();
};

const readQueryCallback = async (id) => {
    return Ticket
    .findById(id)
    .populate([
        { path: 'user'},
        { path: 'organization' },
        { path: 'category' }
    ])
    .exec();
};

router.get('/', 
    controller.createReadAllHandler(Ticket, readAllQueryCallback));

router.get('/:id([0-9a-zA-Z])', 
    controller.createReadHandler(Ticket, readQueryCallback));

router.post('/create', 
    controller.createCreateHandler(Ticket));

router.patch('/:id([0-9a-zA-Z]{24})', 
    controller.createUpdateHandler(Ticket));

router.delete('/([0-9a-zA-Z]{24})', 
    controller.handleNotImplemented);

module.exports = router;