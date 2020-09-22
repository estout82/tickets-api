
const express = require('express');
const debug = require('../helper/debug');

const handleGeneralError = (err, req, res, next) => {
    next(err);
}

// TODO: fix this
const handleValidateError = (err, req, res, next) => {
    // forward to error middleware
    next({
        status: 'request err',
        msg: 'invalid data',
        friendlyMsg: 'Error while saving, invalid data',
        debug: debug.replace(err)
    });
}

const handleQueryError = (err, req, res, next) => {
    res.status(500);
    next({
        status: 'query err',
        msg: err.message,
        friendlyMsg: 'Error while accessing database',
        debug: debug.replace(err)
    });
}

const handleSaveError = (err, req, res, next) => {
    res.status(500);
    next({
        status: 'save err',
        msg: err.message,
        friendlyMsg: 'Error while saving to database',
        debug: debug.replace(err)
    });
}

const handleEmptyRequest = (req, res, next) => {
    res.status(400);
    next({
        status: 'error',
        msg: 'empty request body',
        friendlyMsg: 'Error while saving, no data in request'
    });
}

const handleNotImplemented = (req, res) => {
    res.status(400).json({
        status: 'error',
        msg: 'not implemented',
        friendlyMsg: 'Error while saving, no route'
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
                status: 'error',
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

// helper function to recursivley update document
// TODO: cleanup
const updateDocumentFields = (data, doc) => {
    // iterate over document keys and process
    Object.keys(data).forEach(key => {
        const value = data[key];

        // if value is object, process recursivley
        if (typeof value === 'object') {
            // only update field if the new object has properties
            if (Object.keys(value).length > 0) {
                // if document typee is array, and key does not exist, need to add element to array
                if (doc instanceof Array && !doc[key]) {
                    doc.push(value);
                    console.log(doc);
                    return;
                }

                doc[key] = updateDocumentFields(value, doc[key] ? doc[key] : {});
                return;
            } else {
                // if value of value is {}, delete the object

                // if type of doc (or sub doc) is array, remove the eleement specified by key from array
                if (doc instanceof Array) {
                    doc = [
                        ...doc.slice(0, key),
                        ...doc.slice(key + 1)
                    ];
                    return;
                }

                // if not array, just delete the property
                delete doc[key];
                return;
            }
        }

        doc[key] = value;
    });

    return doc;
}

// factory method for creating a generic update handler for a controller
const createUpdateHandler = (model) => {
    // return function w/ local binding for model
    return async (req, res, next) => {
        const id = req.params.id;
        let doc = null;

        // ensure request body is not null
        if (!req.body || Object.keys(req.body).length < 1) {
            return handleEmptyRequest(req, res, next);
        }

        // get doc from db
        try {
            doc = await model.findById(id);

            if (!doc) {
                return res.status(401).json({
                    status: 'error',
                    msg: `${id} not in collection`
                });
            }
        } catch (err) {
            return handleQueryError(req, res, err);
        }

        // update doc fields
        doc = updateDocumentFields(req.body, doc);

        // validate new fields
        try {
            let validateResult = await doc.validate();
        } catch (err) {
            return handleValidateError(err, req, res, next);
        }

        // save updated doc
        try {
            let queryResult = await doc.save();

            res.status(200).json({
                status: 'ok',
                msg: 'updated',
                friendlyMsg: 'Save sucessful',
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