
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
const TicketStatus = require('../models/TicketStatus');

const router = express.Router();

/**
 * auth
 */
// router.get('/',  auth(['all', 'ticket.all', 'ticket.status.read']));
// router.get('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.status.read']));
// router.post('/create', auth(['all', 'ticket.all', 'ticket.status.create']));
// router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.status.update']));
// router.delete('/:id([0-9a-zA-Z])', auth(['all', 'ticket.all', 'ticket.status.delete']));

/**
 * routes
 */
router.get('/', 
    controller.createReadAllHandler(TicketStatus));

router.get('/:id([0-9a-zA-Z]{24})',
    controller.createReadHandler(TicketStatus));

router.post('/create',
    controller.createCreateHandler(TicketStatus));

router.patch('/:id([0-9a-zA-Z]{24})',
    controller.createUpdateHandler(TicketStatus));

router.delete('/:id([0-9a-zA-Z])',
    controller.handleNotImplemented);

module.exports = router;