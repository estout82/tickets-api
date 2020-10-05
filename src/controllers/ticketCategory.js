
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        ticket.js
 * summary:     controller for ticket category data / objects
 *              - this is mounted on /api/ticket/category
 */

const express = require('express');
const controller = require('../helper/controller');
const { auth } = require('../auth/auth');
const TicketCategory = require('../models/TicketCategory');

const router = express.Router();

/**
 * auth
 */
// router.get('/',  auth(['all', 'ticket.all', 'ticket.category.read']));
// router.get('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.category.read']));
// router.post('/create', auth(['all', 'ticket.all', 'ticket.category.create']));
// router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.category.update']));
// router.delete('/:id([0-9a-zA-Z])', auth(['all', 'ticket.all', 'ticket.category.delete']));

/**
 * routes
 */
router.get('/', 
    controller.createReadAllHandler(TicketCategory));

router.get('/:id([0-9a-zA-Z]{24})',
    controller.createReadHandler(TicketCategory));

router.post('/create',
    controller.createCreateHandler(TicketCategory));

router.patch('/:id([0-9a-zA-Z]{24})',
    controller.createUpdateHandler(TicketCategory));

router.delete('/:id([0-9a-zA-Z])',
    controller.handleNotImplemented);

module.exports = router;