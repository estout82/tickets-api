
const mongoose = require('mongoose');
const Meta = require('../models/Meta');
const debug = require('../helper/debug');
const log = require('../helper/log')

function handleError(result, msg, debugMsg) {
    result.status = 'error';

    if (!result.msgs) result.msgs = [];
    result.msgs.push(msg);

    if (!result.debug) result.debug = [];
    result.debug.push(debug.replace(debugMsg));

    return result;
}

// adds the default data to the database
async function initMetaCollection() {
    // holds the result of the operations
    let result = { status: 'ok' };

    const defaultOrderMetaData = {
        metaCategory: "order",
        categories: [],
        statuses: [],
        nextPoNumber: 1
    };

    const defaultTicketMetaData = {
        metaCategory: "ticket",
        categories: [],
        statuses: [],
        formDefinitions: {
            default: {
                title: {
                    type: 'smalltext'
                },
                description: {
                    type: 'largetext'
                }
            }
        },
        flowDefinitions: {}
    }

    // add order metadata to the meta collection
    try {
        let orderDocument = new Meta(defaultOrderMetaData);
        let saveResult = await orderDocument.save();
    } catch (error) {
        result = handleError(result, 'error while saving order meta document', error);
    }

    // add ticket metadata to the meta collection
    try {
        let ticketDocument = new Meta(defaultTicketMetaData);
        let saveResult = await ticketDocument.save();
    } catch (error) {
        result = handleError(result, 'error while saving ticket meta document', error);
    }

    // set the init document to reflect the status of the meta database
    try {
        const initData = {
            metaCategory: "init",
            status: result.status
        };

        await new Meta(initData).save();
    } catch (error) {
        result = handleError(result, 'error while saving init meta document', error);
    }

    return result;
}

// this function is called when the meta database is accessed to ensure that the default data is there
async function ensureMetaCollectionInitalized() {
    try {
        let initDocument = await Meta.findOne({ metaCategory: "init" });

        console.log(initDocument);

        // database has not ben initalized, initalize
        if (!initDocument) {
            let initResult = await initMetaCollection();

            if (initResult === 'error') {
                // collection init failed

                // print all error messages
                if (initResult.msgs) {
                    initResult.msgs.forEach(msg => {
                        log.error(msg, 0);
                    });
                }

                return false;
            } else {
                // collection init sucess
                return true;
            }
        }

        // an error occured during initalization, return false
        if (initDocument.status === 'error') {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        const msg = `could not verify meta database was initalized ${debug.replace(error)}`;
        log.error(msg, 0);
    }
}

function getNextPoNumber() {

}

module.exports = {
    ensureMetaCollectionInitalized
}