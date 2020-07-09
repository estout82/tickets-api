
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

const auth = async (req, res, next) => {
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
            debug: err.message
        });

        return;
    }

    // decode token
    try {
        const decodedToken = jwt.decode(token);

        // get user permissions from db
        
        // TODO: respond to permissions accordingly

        next(); // auth ok, go to next middleware

    } catch (err) {
        res.status(500).json({
            msg: 'error decoding token'
        });

        return;
    }
};

module.exports = {
    auth,
    hashPassword,
    createAccessToken,
    createRefreshToken
};