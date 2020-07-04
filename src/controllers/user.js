
const Controller = require('../helper/controller');
const validate = require('../models/User');
const authHelper = require('../auth/authHelper');
const User = require('../models/User');


const controller = new Controller(User, {
    shortReadFields: 'firstName lastName email',
    preCreateCallback: async (req, res) => {
        // no sso, storing password locally
        if (req.body.sso === 'none') {
            try {
                let plainTextPassword = Buffer.from(req.body.password, 'base64')
                    .toString('ascii');
                let hashedPassword = await authHelper.hashPassword(plainTextPassword);
                req.body.password = hashedPassword;
            } catch (err) {
                res.status(500).json({
                    msg: 'unable to hash password',
                    debug: err.message
                });

                return;
            }
        }
    }
});

module.exports = controller;