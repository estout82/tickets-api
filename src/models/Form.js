
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = Schema({
    name: {
        type: String,
        unique: true
    },
    size: {
        type: String,
        match: /[0-9],[0-9]/
    },
    fields: [{
        name: {
            type: String,
            unique: true
        },
        position: {
            type: String,
            match: /[0-9],[0-9]/
        },
        size: {
            type: String,
            match: /[0-9],[0-9]/
        },
        type: {
            type: String,
            enum: ['input', 'text', 'radio', 'check', 'select'],
            required: true
        },
        options: {
            type: [],
            default: null
        }
    }]
});

module.exports = mongoose.model('Form', formSchema);