
const express = require('express');
const controller = require('../helper/controller');
const TicketCategory = require('../models/TicketCategory');

const router = express.Router();

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