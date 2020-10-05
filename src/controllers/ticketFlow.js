
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
const TicketFlow = require('../models/TicketFlow');

const router = express.Router();

/**
 * auth
 */
// router.get('/',  auth(['all', 'ticket.all', 'ticket.flow.read']));
// router.get('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.flow.read']));
// router.post('/create', auth(['all', 'ticket.all', 'ticket.flow.create']));
// router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.flow.update']));
// router.delete('/:id([0-9a-zA-Z])', auth(['all', 'ticket.all', 'ticket.flow.delete']));

/**
 * routes
 */
router.get('/', 
    controller.createReadAllHandler(TicketFlow));

router.get('/:id([0-9a-zA-Z]{24})',
    controller.createReadHandler(TicketFlow));

router.post('/create',
    controller.createCreateHandler(TicketFlow));

router.patch('/:id([0-9a-zA-Z]{24})',
    controller.createUpdateHandler(TicketFlow));

router.delete('/:id([0-9a-zA-Z])',
    controller.handleNotImplemented);

module.exports = router;