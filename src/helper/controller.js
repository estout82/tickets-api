
// TODO: maybe pass in a callback for actually querying data?

const express = require('express');
const debug = require('../helper/debug');

// OPTIONS
// shortReadFields          -> fields to select when executing bulk read
// longReadPopulateFields   -> fields to populate on long read

class Controller {
    constructor(model, options) {
        // setup members
        this._router = express.Router();
        
        // pull all options out of options object
        if (options) {
            this._shortReadFields = options.shortReadFields;
            this._longReadPopulateFields = options.longReadPopulateFields
            this._preCreateCallback = options.preCreateCallback;
            this._postCreateCallback = options.postCreateCallback;
        }

        // ensure model is not null
        if (model == null) {
            throw new Error('model cannot be null!');
        }

        this._model = model;

        // setup routes
        this._router.get('/', (req, res) => {
            this._handleReadAll(req, res)
        });
        
        this._router.get('/:id([0-9a-zA-Z]{24})', this._handleRead);

        this._router.post('/create', (req, res) => {
            this._handleCreate(req, res, this._preCreateCallback, 
                this._postCreateCallback);
        });

        this._router.patch('/:id([0-9a-zA-Z]{24})', this._handleUpdate);
        this._router.delete('/:id([0-9a-zA-Z]{24})', this._handleDelete);
    }

    // binds the router to another router / app
    bind = (target, path) => {
        target.use(path, this._router);
    }

    // attaches a custom get handler
    attachGetHandler = (path, handler) => {
        this._router.get(path, handler);
    }

    // attaches a custom post handler
    attachPostHandler = (path, handler) => {
        this._router.post(path, handler);
    }

    overrideReadAll(callback) {
        this._handleReadAll = callback;
    }

    overrideRead(callback) {
        this._handleRead = callback;
    }

    overrideCreate(callback) {
        this._handleCreate = callback;
    }

    overrideUpdate(callback) {
        this._handleUpdate = callback;
    }

    overrideDelete(callback) {
        this._handleDelete = callback;
    }

    // read all docs from collection
    _handleReadAll = async (req, res) => {
        let data = {};

        // only return some fields if shortRead field is set
        if (this._shortReadFields) {
            try {
                data = await this._model.find()
                    .select(this.shortReadFields)
                    .exec();

                return res.status(200).json({
                    status: 'ok',
                    data: data
                });
            } catch (err) {
                return this._handleQueryError(req, res, err);
            }
        }
    }

    // read a single doc
    _handleRead = async (req, res) => {
        const id = req.params.id; // this is already a valid oid b/c regex in router

        try {
            let query = this._model.findById(id);
            
            // populate fields
            if (this._longReadPopulateFields) {
                query.populate(this._longReadPopulateFields);
            }

            let data = await query.exec();

            return res.status(200).json({
                status: 'ok',
                data: data
            });
        } catch (err) {
            return this._handleQueryError(req, res, err);
        }
    }

    // create a new doc
    _handleCreate = async (req, res, pre, post) => {
        if (pre && !pre(req, res)) {
            return;
        }

        // ensure body is not empty
        if (!req.body) {
            return this._handleEmptyRequest(req, res);
        }

        let doc = new this._model(req.body);

        // validate doc
        try {
            let validateError = await doc.validate();
        } catch (err) {
            return this._handleValidateError(req, res, err);
        }

        // preform query
        try {
            let saveResult = await doc.save();

            return res.status(201).json({
                status: 'ok',
                msg: 'created',
                data: [ saveResult._id ]
            });
        } catch (err) {
            return this._handleSaveError(req, res, err);
        }
    }

    // update existing doc
    _handleUpdate = async (req, res) => {
        const id = req.params.id;
        let doc = null;

        // ensure request body is not null
        if (!req.body) {
            return this._handleEmptyRequest(req, res);
        }

        // get doc from db
        try {
            doc = await this._model.findById(id);

            if (!doc) {
                return res.status(401).json({
                    status: 'err',
                    message: `${id} not in collection`
                });
            }
        } catch (err) {
            return this._handleQueryError(req, res, err);
        }

        // update doc fields
        Object.keys(req.body).forEach((key) => {
            const value = req.body[key];
            doc[key] = value;
        });

        // validate new fields
        try {
            let validateResult = await doc.validate();
        } catch (err) {
            return this._handleValidateError(req, res, err);
        }

        // save updated doc
        try {
            let queryResult = await doc.save();

            res.status(200).json({
                status: 'ok',
                msg: 'updated',
                data: [queryResult._id]
            });
        } catch (err) {
            return this._handleQueryError(req, res, err);
        }
    }

    // delete existing doc
    _handleDelete = async (req, res) => {
         
    }
    
    // handle an error after a validate
    _handleValidateError = (req, res, err) => {
        const data = {};
        const errors = err.errors;

        // extract nessecary data from each error
        Object.keys(errors).forEach((key) => {
            const errorValue = errors[key]; 

            data[errorValue.path] = {
                message: errorValue.properties.message // extract message
            };
        });

        res.status(400).json({
            status: 'request error',
            message: 'invalid data',
            data: data
        });
    }

    _handleQueryError = (req, res, err) => {
        res.status(500).json({
            status: 'query err',
            msg: err.message,
            debug: debug.replace(err)
        });
    }

    _handleSaveError = (req, res, err) => {
        res.status(500).json({
            status: 'save err',
            msg: err.message,
            debug: debug.replace(err)
        });
    }

    _handleEmptyRequest = (req, res) => {
        res.status(400).json({
            status: 'request err',
            msg: 'empty body'
        });
    }
}

module.exports = Controller;