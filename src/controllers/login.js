
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        ticket.js
 * summary:     controller for handling user login
 *              - mounted on /login (not auth protected)
 */

// TODO: redo this with new strategy and controller class
// TODO: add refresh tokens

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createAccessToken, createRefreshToken } = require('../auth/auth');
const User = require('../models/User');
const debug = require('../helper/debug');

const router = express.Router();
const refreshTokenCookieName = '981yiuh4ejkwjkhiquwdfnawkjn=';

/**
 * auth
 */

 // none - login is unprotected

/**
 * routes
 */
router.get('/', async (req, res) => {
    // check for refresh token
    const refreshCookie = req.cookies.refresh;

    console.log(refreshCookie);

    if (refreshCookie) {
        // validate refresh token and issue new refresh token
        if (jwt.verify(refreshCookie, process.env.REFRESH_TOKEN_SECRET)) {
            // TODO: store refresh tokens in db?

            // attempt to decode token
            let decodedRefreshToken = null;

            try {
                decodedRefreshToken = jwt.decode(refreshCookie);
            } catch (err) {
                res.status(500).json({
                    status: 'err',
                    msg: 'bad refresh token',
                    debug: debug.replace(err)
                });

                return;
            }

            const newAccessToken = createAccessToken(decodedRefreshToken.oid);
            const newRefreshToken = createRefreshToken(decodedRefreshToken.oid, 
                decodedRefreshToken.userType);

            // save new refresh token as cookie
            res.cookie('refresh', newRefreshToken);
            
            // send access token in response body
            res.status(200).json({
                msg: 'sucess',
                data: {
                    token: newAccessToken,
                    userType: decodedRefreshToken.userType
                }
            });

            return;
        }
    }

    // check for credentials in header
    const credentials = req.get('x-login');

    if (!credentials) {
        res.status(401).json({
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
        let user = await User.findOne({ email: loginEmail })
        .select('password userType');

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
        const accessToken = await createAccessToken(user._id);

        // store refresh token as a cookie
        const refreshToken = await createRefreshToken(user._id, user.userType);

        res.cookie('refresh', refreshToken);

        res.status(200).json({
            msg: 'sucess',
            data: {
                token: accessToken,
                userType: user.userType
            }
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