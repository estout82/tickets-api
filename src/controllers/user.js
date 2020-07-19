
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        user.js
 * summary:     controller for user data / objects
 *              - this is mounted on /api/user
 */

const express = require('express');
const { 
    createReadAllHandler,
    createReadHandler,
    createUpdateHandler,
    createCreateHandler,
    isBodyEmpty,
    handleEmptyRequest,
    handleGeneralError,
    handleValidateError,
    handleQueryError,
    handleNotImplemented
} = require('../helper/controller');
const validate = require('../models/User');
const { auth } = require('../auth/auth');
const { hashPassword } = require('../auth/auth');
const User = require('../models/User');
const UserRole = require('../models/UserRole');

const router = express.Router();

// setup auth for all routes --------------------------------------
router.get('/', auth(['all', 'user.all', 'user.read']));
router.get('/:id([0-9a-zA-Z]{24})', auth(['all', 'user.all', 'user.read']));
router.post('/create', auth(['all', 'user.all', 'user.create']));
router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'user.all', 'user.update']));
router.delete('/:id([0-9a-zA-Z]{24})', auth(['all', 'user.all', 'user.delete']));
router.get('/role', auth(['all', 'user.role.all', 'user.role.read']));
router.post('/role/create', auth(['all', 'user.role.all', 'user.role.update']));

// routes ---------------------------------------------------------
const readAllQueryCallback = async () => {
    return User
    .find()
    .select(`firstName lastName email`)
    .exec();
}

router.get('/', 
    createReadAllHandler(User, readAllQueryCallback));

// TODO: this will have to be revamped
const readQueryCallback = async (id) => {
    return User
    .findById(id)
    .populate('roles.role')
    .exec();
}

router.get('/:id([0-9a-zA-Z]{24})',
    createReadHandler(User, readQueryCallback));

// custom because we have to handle password hashing and what not
router.post('/create', async (req, res, next) => {
    // ensure body is not empty
    if (isBodyEmpty(req)) {
        return handleEmptyRequest(req, res, next);
    }

    // attempt to hash password
    if (req.body.sso === 'none') {
        // make sure there is a password proved with request
        if (!req.body.password) {
            return handleGeneralError({
                status: 'request err',
                msg: 'non-sso account requires password',
                data: {
                    password: {
                        message: 'non-sso account requires password'
                    }
                }
            })
        }

        // no sso, storing password locally
        try {
            let plainTextPassword = Buffer.from(req.body.password, 'base64')
                .toString('ascii');

            let hashedPassword = await hashPassword(plainTextPassword);

            req.body.password = hashedPassword;
        } catch (err) {
            res.status(500).json({
                msg: 'unable to hash password',
                debug: err.message
            });

            return;
        }
    } else if (req.body.sso === 'aad') {
        
    } else {
        return res.status(400).json({
            status: 'err',
            msg: 'invalid sso type'
        });
    }

    // create the doc
    let doc = new User(req.body);

    // validate thee doc
    try {
        let validateResult = await doc.validate();
    } catch (err) {
        return handleValidateError(err, req, res, next);
    }

    // save doc
    try {
        let saveResult = await doc.save();

        return res.status(201).json({
            status: 'ok',
            msg: 'created',
            data: saveResult._id
        });
    } catch (err) {
        return handleQueryError(err, req, res, next);
    }
});

// TODO: fix this and make a seperate change password endpoint
router.patch('/:id([0-9a-zA-Z]{24})', handleNotImplemented);

router.delete('/:id([0-9a-zA-Z]{24})', handleNotImplemented);

// role routes ----------------------------------------------------

// TODO: move this to its own file?

router.get('/role', handleNotImplemented);

router.post('/role/create', createCreateHandler(UserRole));

module.exports = router;