
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        auth.js
 * summary:     middleware to check is a user is authed
 */

// TODO: send password as hash with user and password
// TODO: nonce type thing to prevent replay attacks

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const debug = require('../helper/debug');
const User = require('../models/User');

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10); // this is a promise
}

const createAccessToken = (userOid) => {
    return jwt.sign({ oid: userOid }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1hr',
        notBefore: '10ms'
    });
};

const createRefreshToken = (userOid) => {
    // TODO: implement this
    return null;
};

// factory for auth middleware
const auth = (acceptedPerms) => {

    // return closure function that has access to acceptedParams
    return async (req, res, next) => {
        // check for authorization header
        if (!req.get('x-auth')) {
            // no auth header
            res.status(401).json({
                msg: 'unauthorized'
            });

            return;
        }

        // verify token
        const token = req.get('x-auth');

        try {
            if (!jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
                // access token is bad!
                res.status(401).json({
                    msg: 'unauthorized'
                });
        
                return;
            } 
        } catch (err) {
            res.status(400).json({
                msg: 'bad token',
                debug: debug.replace(err.message)
            });

            return;
        }

        // decode token
        let decodedToken = null;

        try {
            decodedToken = jwt.decode(token);

        } catch (err) {
            res.status(500).json({
                msg: 'error decoding token',
                debug: debug.replace(err.message)
            });

            return;
        }

        // verify perms
        try {
            const user = await User.findById(decodedToken.oid)
            .select('roles')
            .populate('roles.role')
            .exec();

            if (!user) {
                res.status(401).json({
                    msg: 'unauthorized',
                    debug: debug.replace('user in token not found')
                });
            }

            // TODO: convert this so multiple perms can be required

            let permsValid = validatePermsArr(acceptedPerms, user.roles);

            if (!permsValid) {
                res.status(401).json({
                    msg: 'user does not have permission'
                });

                return;
            }
        } catch (err) {
            res.status(500).json({
                msg: 'server error while checking user perms',
                debug: debug.replace(err)
            });

            return;
        }

        next(); // auth ok, go to next middleware
    }
}

// TODO: make these two functions suck less

const validatePermsArr = (acceptedPerms, userRoles) => {
    // ensure acceptedPerms is an array
    if (!acceptedPerms instanceof Array) {
        acceptedPerms = [acceptedPerms];
    }

    for (acceptedPerm of acceptedPerms) {
        for (userRole of userRoles) {
            if (userRole.role.perms.includes(acceptedPerm)) {
                return true;
            }
        }
    }

    return false;
}

module.exports = {
    auth,
    hashPassword,
    createAccessToken,
    createRefreshToken
};