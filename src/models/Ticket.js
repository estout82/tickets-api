
const mongoose = require('mongoose');
const validate = require('../helper/validate');
const TicketCategory = require('../models/TicketCategory');
const Organization = require('../models/Organization');
const User = require('../models/User');
const File = require('../models/File');

const Schema = mongoose.Schema;

const ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        default: null
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'TicketCategory',
        validate: {
            validator: async (value) => {
                let result = await validate.validateId(TicketCategory, value);
                return result;
            },
            message: props => `${props.value} is not a ticket category id`
        }
    },
    organization: {
        type: String,
        default: null
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        validate: {
            validator: async (value) => {
                let result = await validate.validateId(User, value);
                return result;
            },
            message: props => `${props.value} is not a user id`
        }
    },
    timeCreated: {
        type: Date,
        default: Date.now()
    },
    comments: {
        type: {
            creator: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                validate: {
                    validator: async (value) => {
                        let result = await validate.validateId(User, value);
                        return result;
                    },
                    message: props => `${props.value} is not a user id`
                }
            },
            timeCreated: {
                type: Date,
                default: Date.now(),
                required: true
            },
            body: {
                type: String,
                default: ''
            },
            files: {
                type: [Schema.Types.ObjectId],
                default: null,
                ref: 'File',
                validate: {
                    validator: async (value) => {
                        let result = await validate.validateId(File, value);
                        return result;
                    },
                    message: props => `${props.value} is not a file id`
                }
            }
        },
        default: null
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);