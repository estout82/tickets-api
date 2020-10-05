
/**
 * name:        eric stoutenburg
 * email:       eric.stoutenburg@baysideonline.com
 * date:        07 06 2020
 * file:        ticket.js
 * summary:     controller for ticket data / objects
 *              - this is mounted on /api/ticket
 */

const express = require('express');
const controller = require('../helper/controller');
const { auth } = require('../auth/auth');
const Ticket = require('../models/Ticket');
const { handleSaveError } = require('../helper/controller');
const cateegoryRouter = require('./ticketCategory');

/**
 * constants ----------------------------------------------------------------------
 */
const numTicketsPerPage = 25;

const router = express.Router();

/**
 * auth
 */
// router.get('/', auth(['all', 'ticket.all', 'ticket.read']));
// router.get('/:id([0-9a-zA-Z])', auth(['all', 'ticket.all', 'ticket.read']));
// router.post('/create', auth(['all', 'ticket.all', 'ticket.create']));
// router.patch('/:id([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.update']));
// router.delete('/([0-9a-zA-Z]{24})', auth(['all', 'ticket.all', 'ticket.delete']));

/**
 * mount sub-routers
 */
router.use('/category', cateegoryRouter);

/**
 * query callbacks
 */
const readAllQueryCallback = async () => {
    return Ticket
    .find()
    .select('title number category organization user')
    .populate([
        { path: 'user', select: 'firstName lastName email' },
        { path: 'organization', select: 'name' },
        { path: 'category', select: 'name' }
    ])
    .exec();
};

const readQueryCallback = async (id) => {
    return Ticket
    .findById(id)
    .populate('user')
    .populate('organization')
    .populate('category')
    .populate('status')
    .populate('flows')
    .populate('form')
    .populate('comments.user', 'firstName lastName')
    .exec();
};

/**
 * routes
 */
router.get('/', 
    controller.createReadAllHandler(Ticket, readAllQueryCallback));

router.get('/:id([0-9a-zA-Z]{24})', 
    controller.createReadHandler(Ticket, readQueryCallback));

/**
 * responds with shallow data about a single page of tickets
 */
router.get('/page/:number([0-9]+)', 
    controller.createReadPageHandler(Ticket, numTicketsPerPage, readAllQueryCallback));

router.post('/create', 
    controller.createCreateHandler(Ticket));

router.patch('/:id([0-9a-zA-Z]{24})', 
    controller.createUpdateHandler(Ticket));

router.delete('/([0-9a-zA-Z]{24})', 
    controller.handleNotImplemented);

/**
 * updates a comment
 */
router.patch('/:id([0-9a-zA-Z]{24})/comment/:index([0-9]+)', async (req, res, next) => {
    
});

/**
 * adds a new comment
 */
router.post('/:id([0-9a-zA-Z]{24})/comment/', async (req, res, next) => {
    const ticketId = req.params.id;
    // TODO: validate ticket id

    // ensure body is not empty
    if (!req.body) return handleEmptyRequest(req, res, next);

    // TODO: validate body

    // retrieve the ticket doc
    let doc;

    try {
        doc = await Ticket.findById(ticketId);
    } catch (error) {
        return controller.handleQueryError(error, req, rse, next);
    }

    // if comments array does not exist, create it
    if (!(doc.comments instanceof Array)) {
        doc.comments = [];
    }

    // add comment to comments array
    doc.comments.push(req.body);

    // save the doc
    try {
        await doc.save(); 

        res.status(201).json({
            status: 'ok',
            friendlyMsg: 'Comment added sucessfully',
            msg: 'comment added',
            data: {
                commentIndex: doc.comments.length - 1
            }
        });

        return;
    } catch (error) {
        return controller.handleSaveError(error, req, res, next);
    }
});

/**
 * deletes a comment
 */
router.delete('/:id([0-9a-zA-Z]{24})/comment/:index([0-9]+)', async (req, res, next) => {
    
});

/**
 * adds a todo to the todo list
 */
router.post('/:id([a-zA-Z0-9]{24})/todo', async (req, res, next) => {
    const ticketId = req.params.id;
    let doc;
    let newTodoId;
    // TODO: validate ticket id

    // ensure body is not empty
    if (!req.body) return handleEmptyRequest(req, res, next);

    // TODO: validate body

    // retrieve the ticket doc
    try {
        doc = await Ticket.findById(ticketId);
    } catch (error) {
        return controller.handleQueryError(error, req, rse, next);
    }

    // if todos array does not exist, create it
    if (!(doc.todos instanceof Array)) {
        doc.todos = [];
    }

    // add comment to comments array
    doc.todos.push(req.body);
    newTodoId = doc.todos[doc.todos.length - 1]._id

    // save the doc
    try {
        await doc.save(); 

        res.status(201).json({
            status: 'ok',
            friendlyMsg: 'Todo added sucessfully',
            msg: 'todo added',
            data: {
                todoId: newTodoId
            }
        });

        return;
    } catch (error) {
        return controller.handleSaveError(error, req, res, next);
    }
});

/**
 * updates a comment
 */
router.patch('/:id([a-zA-Z0-9]{24})/todo/:todoId([a-zA-Z0-9]{24})', async (req, res, next) => {
    const ticketId = req.params.id;
    const todoId = req.params.todoId;
    // TODO: validate ticket id

    // ensure body is not empty
    if (!req.body) return handleEmptyRequest(req, res, next);

    // TODO: validate body

    // retrieve the ticket doc
    let doc;

    try {
        doc = await Ticket.findById(ticketId);
    } catch (error) {
        return controller.handleQueryError(error, req, rse, next);
    }

    // find todo in the array of subdocuments
    let todo = doc.todos.id(todoId);

    // if subdoc doesn't exist, send 404
    if (!todo) {
        res.status(404).json({
            status: 'error',
            friendlyMsg: 'Todo not found',
            msg: `no todo in ticket ${ticketId} with id ${todoId}`
        });

        return;
    }

    // assign props from request body to todo
    Object.assign(todo, req.body);

    // save the updated doc doc
    try {
        await doc.save(); 

        res.status(201).json({
            status: 'ok',
            friendlyMsg: 'Sucess',
            msg: 'todo patched',
            data: {
                ticketId: ticketId,
                todoId: todoId
            }
        });

        return;
    } catch (error) {
        return controller.handleSaveError(error, req, res, next);
    }
});

router.delete('/:id([a-zA-Z0-9]{24})/todo/:todoId([a-zA-Z0-9]{24})', async (req, res, next) => {
    const ticketId = req.params.id;
    const todoId = req.params.todoId;
    let doc;

    // retrieve the doc
    try {
        doc = await Ticket.findById(ticketId);
    } catch (error) {
        // TODO: 
    }

    doc.todos.id(todoId).remove();

    try {
        doc.save();

        res.status(200).json({
            status: 'ok',
            friendlyMsg: 'Sucess',
            msg: 'todo deleted',
            date: {
                todoId: todoId
            }
        });

        return;
    } catch (error) {
        controller.handleSaveError(error, req, res, next);
        return;
    }
});

module.exports = router;