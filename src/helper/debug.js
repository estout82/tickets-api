
// ensure env is imported
require('dotenv').config();

const replace = (value) => process.env.DEBUG ? value : null;

module.exports = {
    replace: replace
}