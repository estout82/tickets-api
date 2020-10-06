
const Counter = require('../models/Counter');
const log = require('./log');

async function getNext(modelName) {
    try {
        let doc = await Counter.findOneAndUpdate(
            { modelName: modelName }, 
            { $inc: { count: 1 } },
            { new: true, upsert: true, useFindAndModify: false });

        return doc.count;
    } catch (error) {
        log.error(`error during get next count for ${modelName}`, error);
        return null;
    }
}

module.exports = {
    getNext
}