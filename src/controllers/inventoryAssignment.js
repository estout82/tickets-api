
const express = require('express');
const mongoose = require('mongoose');
const controller = require('../helper/controller');
const InventoryAssignment = require('../models/InventoryAssignment');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let data = await InventoryAssignment.find();

        res.status(200).json({
            status: 'ok',
            data: data
        });
    } catch (err) {
        controller.handleQueryError(err, req, res, next);
    }
});

router.get('/:id([0-9a-zA-Z]{24})', async (req, res, next) => {
    res.status(400).json({
        status: 'err',
        msg: 'not implemented'
    });
});

router.post('/create', async (req, res, next) => {
    // make sure body is not null
    if (!req.body) {
        res.status(400);
        return next({
            status: 'request err',
            msg: 'request body is empty'
        });
    }

    // create a new doc
    let doc = new InventoryAssignment(req.body);

    // validate doc
    try {
        let validateResult = await doc.validate();
    } catch (err) {
        return controller.handleValidateError(err, req, res, next);
    }

    try {
        let queryResult = await doc.save();

        return res.status(201).json({
            status: 'ok',
            msg: 'created',
            data: queryResult._id
        });
    } catch (err) {
        return controller.handleSaveError(err, req, res, next);
    }
});

module.exports = router;