
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
const TicketForm = require('../models/TicketForm');

const router = express.Router();

/**
 * auth
 */
// router.get('/',  auth(['all', 'ticket.all', 'ticket.form.read']));
// router.get('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.form.read']));
// router.post('/create', auth(['all', 'ticket.all', 'ticket.form.create']));
// router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.form.update']));
// router.delete('/:id([0-9a-zA-Z])', auth(['all', 'ticket.all', 'ticket.form.delete']));

/**
 * routes
 */
router.get('/', 
    controller.createReadAllHandler(TicketForm));

router.get('/:id([0-9a-zA-Z]{24})',
    controller.createReadHandler(TicketForm));

router.post('/create',
    controller.createCreateHandler(TicketForm));

router.patch('/:id([0-9a-zA-Z]{24})',
    controller.createUpdateHandler(TicketForm));

router.delete('/:id([0-9a-zA-Z])',
    controller.handleNotImplemented);

module.exports = router;