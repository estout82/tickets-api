
const mongoose = require('mongoose');
const validate = require('../helper/validate');
const TicketCategory = require('../models/TicketCategory');
const Organization = require('../models/Organization');
const User = require('../models/User');
const File = require('../models/File');

const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
        ref: 'File',
        // validate: {
        //     validator: async (value) => {
        //         if (value === null) return true;
        //         let result = await validate.validateId(File, value);
        //         return result;
        //     },
        //     message: props => `${props.value} is not a file id`
        // }
    }
});

const todoSchema = mongoose.Schema({
    label: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false // set completed to false by default
    }
});

const schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        default: null
    },
    number: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'TicketCategory'
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'TicketStatus'
    },
    form: {
        type: Schema.Types.ObjectId,
        ref: 'TicketForm'
    },
    flows: {
        type: [Schema.Types.ObjectId],
        ref: 'TicketFlow'
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        validate: {
            validator: async (value) => {
                let result = await validate.validateId(Organization, value);
                return result;
            },
            message: props => `${props.value} is not a organization id`
        },
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
    todos: {
        type: [todoSchema]
    },
    comments: {
        type: [commentSchema],
        default: null
    },
    // stores custom parameters collected by custom ticket form
    // no need for sub doc _id
    parameters: {
        type: [{ value: String, label: String, name: String }]
    }
});

module.exports = mongoose.model('Ticket', schema);