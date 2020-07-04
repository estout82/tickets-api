
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10); // NOTE: this is a promise
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

module.exports = {
    hashPassword,
    createAccessToken,
    createRefreshToken
}