
const mongoose = require('mongoose');
const UserRole = require('./UserRole');
const validate = require('../helper/validate');

const Schema = mongoose.Schema;

const schema = Schema({
    firstName: {
        type: String,
        maxlength: 40,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 125,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [ /([^@]*)@([^\.]+)\.(.+)/, 'email is not valid' ]
    },
    sso: {
        type: String,
        enum: ['none', 'aad'],
        required: true
    },
    password: {
        type: String
    },
    userType: {
        type: String,
        enum: [ 'admin', 'user', 'tech' ]
    },
    roles: {
        type: [
            { 
                role: {
                    type: Schema.Types.ObjectId,
                    ref: 'UserRole',
                    validate: {
                        validator: async (value) => {
                            let valid = true;

                            // loop through every value and see if its in the db
                            value.forEach(async (roleId) => {
                                // only check if valid is still true
                                if (valid) {
                                    valid = validate.validateId(UserRole, roleId);
                                }
                            });

                            return valid;
                        },
                        message: props => `${props.value} is not a valid oid (or doesn't exist)`
                    }
                }
            }
        ],
    },
    refreshToken: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', schema);