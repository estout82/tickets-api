
const Counter = require('../models/Counter');
const log = require('./log');

async function getNext(modelName) {
    let r = null;

    try {
        Counter.findOneAndUpdate({ modelName: modelName }, 
            { $inc: { count: 1 } },
            { new: true, upsert: true },
            (error, counter) => {
                if (error) {
                    log.error(`error during callback get next count for ${modelName}`, error);
                }

                r = counter.count;
            });
    } catch (error) {
        log.error(`error during get next count for ${modelName}`, error);
    }

    return r;
}