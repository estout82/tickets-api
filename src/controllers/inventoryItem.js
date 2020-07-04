
const express = require('express');

const Controller = require('../helper/controller');
const InventoryItem = require('../models/InventoryItem');

const inventoryItemController = new Controller(InventoryItem, {
    shortReadFields: 'name description'
});

module.exports = inventoryItemController;