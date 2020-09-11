
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
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
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
    tickets: {
        type: [Schema.Types.ObjectId]
    },
    assets: {
        type: [Schema.Types.ObjectId]
    },
    items: {
        type: [Schema.Types.ObjectId]
    },
    roles: {
        type: [
            { 
                role: {
                    type: Schema.Types.ObjectId,
                    ref: 'UserRole',
                    validate: {
                        validator: async (value) => {
                            return validate.validateId(UserRole, value);;
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