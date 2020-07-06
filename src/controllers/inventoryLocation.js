

const express = require('express');
const { 
    createReadAllHandler,
    createReadHandler,
    createCreateHandler,
    createUpdateHandler,
    handleNotImplemented 
} = require('../helper/controller');
const InventoryLocation = require('../models/InventoryLocation');

const router = express.Router();

router.get('/', 
    createReadAllHandler(InventoryLocation));

router.get('/:id([0-9a-zA-Z]{24]})', 
    createReadHandler(InventoryLocation));

router.post('/create',
    createCreateHandler(InventoryLocation));

router.patch('/:id([0-9a-zA-Z]{24})',
    createUpdateHandler(InventoryLocation));

router.delete('/:id([0-9a-zA-Z])', handleNotImplemented);

module.exports = router;