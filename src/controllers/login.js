
// TODO: redo this with new strategy and controller class

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authHelper = require('../auth/authHelper');

const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
    // check for credentials in header
    const credentials = req.get('x-login');

    if (!credentials) {
        res.status(400).json({
            msg: 'no credentials'
        });

        return;
    }

    // decode credentials from base64
    const decodedCredentials = Buffer.from(credentials, 'base64')
        .toString('ascii');

    // extract credentials from string
    const regexResult = /([^:]+):([^:]+)/.exec(decodedCredentials);
    
    // if any of the capture groups are missing, bad formatting
    if (regexResult == undefined || 
        regexResult[1] == undefined || 
        regexResult[2] == undefined) {

        // credentials are in invalid format
        res.status(400).json({
            msg: 'bad credentials'
        });

        return;
    }

    const loginEmail = regexResult[1];
    const loginPassword = regexResult[2];

    // look up user in db
    try {
        let user = await User.findOne({ email: loginEmail });

        if (!user) {
            res.status(404).json({
                msg: 'user not found'
            });

            return;
        }

        // validate password
        const passwordValid = await bcrypt.compare(loginPassword, user.password);

        if (!passwordValid) {
            res.status(403).json({
                msg: 'invalid password'
            });

            return;
        }

        // TODO: set refresh token as cookie and in db

        // password validated, gen a access token
        const accessToken = await authHelper.createAccessToken(user._id);

        res.status(200).json({
            msg: 'sucess',
            data: {
                token: accessToken
            },
            debug: jwt.decode(accessToken)
        });

        return;

    } catch (err) {
        res.status(500).json({
            msg: 'error while authenticating user',
            debug: err.message
        });

        return;
    }
});

module.exports = router;