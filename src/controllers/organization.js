
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
const { auth } = require('../auth/auth');
const Organization = require('../models/Organization');

const router = express.Router();

/**
 * auth
 */
// router.get('/', auth(['all', 'organization.all', 'organization.read']));
// router.get('/:id([0-9a-zA-Z])', auth(['all', 'organization.all', 'organization.read']));
// router.post('/create', auth(['all', 'organization.all', 'organization.create']));
// router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'organization.all', 'organization.update']));
// router.delete('/([0-9a-zA-Z]{24})', auth(['all', 'organization.all', 'organization.delete']));

/**
 * routes
 */
router.get('/', 
    controller.createReadAllHandler(Organization));

router.get('/:id([0-9a-zA-Z]{24})', 
    controller.createReadHandler(Organization));

router.post('/create', 
    controller.createCreateHandler(Organization));

router.patch('/:id([0-9a-zA-Z]{24})', 
    controller.createUpdateHandler(Organization));

router.delete('/([0-9a-zA-Z]{24})', 
    controller.handleNotImplemented);

module.exports = router;