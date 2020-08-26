
const express = require('express');
const debug = require('../helper/debug');

const handleGeneralError = (err, req, res, next) => {
    next(err);
}

const handleValidateError = (err, req, res, next) => {
    const data = {};
    const errors = err.errors;

    // extract nessecary data from each error
    Object.keys(errors).forEach((key) => {
        const errorValue = errors[key]; 

        data[errorValue.path] = {
            message: errorValue.properties.message // extract message
        };
    });

    // forward to error middleware
    next({
        status: 'request err',
        msg: 'invalid data',
        data: data
    });
}

const handleQueryError = (err, req, res, next) => {
    res.status(500);
    next({
        status: 'query err',
        msg: err.message,
        debug: debug.replace(err)
    });
}

const handleSaveError = (err, req, res, next) => {
    res.status(500);
    next({
        status: 'save err',
        msg: err.message,
        debug: debug.replace(err)
    });
}

const handleEmptyRequest = (req, res, next) => {
    res.status(400);
    next({
        status: 'err',
        msg: 'empty request body'
    });
}

const handleNotImplemented = (req, res) => {
    res.status(400).json({
        status: 'err',
        msg: 'not implemented'
    });
}

const createReadAllHandler = (model, queryCallback = null) => {
    return async (req, res, next) => {
        try {
            let queryResult = null;

            if (queryCallback) {
                // call queryCallback if exists
                queryResult = await queryCallback();
            } else {
                // call generic query function
                queryResult = await model.find();
            }

            return res.status(200).json({
                status: 'ok',
                data: queryResult
            });
        } catch (err) {
            return handleQueryError(err, req, res, next);
        }
    }
}

const isBodyEmpty = (req) => {
   return !req.body;
}

const createReadHandler = (model, queryCallback = null) => {
    return async (req, res, next) => {
        const id = req.params.id; // this is already a valid oid b/c regex in router

        try {
            let queryResult = null;

            // call custom query method if given
            if (queryCallback) {
                queryResult = await queryCallback(id);
            } else {
                queryResult = await model.findById(id);
            }

            return res.status(200).json({
                status: 'ok',
                data: queryResult
            });
        } catch (err) {
            return handleQueryError(err, req, res, next);
        }
    };
};

const createReadPageHandler = (model, documentsPerPage, queryCallback = null) => {
    return async (req, res, next) => {
        const page = req.params.page - 1;

        // ensure we dont try to access negative pages
        if (page < 0) {
            res.status(404).json({
                status: 'err',
                msg: `invalid page ${page + 1}`
            });
            return;
        }

        try {
            let queryResult = null;

            if (queryCallback) {
                queryResult = await queryCallback(model, page, documentsPerPage);
            } else {
                queryResult = await model.find(null, null, { skip: documentsPerPage * page })
                    .limit(documentsPerPage)
                    .exec();
            }

            return res.status(200).json({
                status: 'ok',
                data: queryResult
            });
        } catch (err) {
            return handleQueryError(err, req, res, next);
        }
    }
}

const createCreateHandler = (model) => {
    return async (req, res, next) => {
        // ensure body is not empty
        if (!req.body) {
            return handleEmptyRequest(req, res, next);
        }

        let doc = new model(req.body);

        // validate doc
        try {
            let validateError = await doc.validate();
        } catch (err) {
            return handleValidateError(err, req, res, next);
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
            return handleSaveError(err, req, res, next);
        }
    };
};

// factory method for creating a generic update handler for a controller
const createUpdateHandler = (model) => {
    // return function w/ local binding for model
    return async (req, res, next) => {
        const id = req.params.id;
        let doc = null;

        // ensure request body is not null
        if (!req.body) {
            return handleEmptyRequest(req, res);
        }

        // get doc from db
        try {
            doc = await model.findById(id);

            if (!doc) {
                return res.status(401).json({
                    status: 'err',
                    message: `${id} not in collection`
                });
            }
        } catch (err) {
            return handleQueryError(req, res, err);
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
            return handleValidateError(req, res, err);
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
            return handleQueryError(req, res, err);
        }
    }
}

module.exports = {
    createReadAllHandler,
    createUpdateHandler,
    createReadHandler,
    createReadPageHandler,
    createCreateHandler,
    handleValidateError,
    handleQueryError,
    handleSaveError,
    handleEmptyRequest,
    handleNotImplemented,
    handleGeneralError,
    isBodyEmpty
};