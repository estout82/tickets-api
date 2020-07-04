
const Controller = require('../helper/controller');
const Ticket = require('../models/Ticket')

const controller = new Controller(Ticket);

const readAll = async (req, res) => {
    try {
        let queryResult = await Ticket.find()
        .select('_id title organization user category')
        .populate([
            { path: 'user', select: 'firstName lastName' }
        ])
        .exec();

        if (!queryResult) {
            res.status(404).json({
                msg: "2000: no data"
            });

            return;
        }

        res.status(200).json({
            msg: 'ok',
            data: queryResult
        });
        
        return;
    } catch (err) {
        res.status(500).json({
            msg: '2001: error during query',
            debug: err.message
        });

        return;
    }
};

const read = async (req, res) => {
    const ticketId = req.params.id;

    try {
        let queryResult = await Ticket.findById(ticketId)
        .populate([
            { path: 'user', select: 'firstName lastName email' },
            { path: 'organization', select: 'name' },
            { path: 'category', select: 'name' }
        ])
        .exec();

        if (!queryResult) {
            res.status(404).json({
                msg: '2000: no data'
            });

            return;
        }

        // data is good, send response
        res.status(200).json({
            msg: 'ok',
            data: queryResult
        });

    } catch (err) {
        res.status(500).json({
            msg: '2001: error during query'
        });

        return;
    }
};

controller.overrideRead(read);
controller.overrideReadAll(readAll);

module.exports = controller;