
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const debug = require('./helper/debug');

// import environment variables
require('dotenv').config();

// import middleware
const auth = require('./auth/auth');

// import controllers
const ticketController = require('./controllers/ticket');
const ticketCategoryController = require('./controllers/ticketCategory');
const userController = require('./controllers/user');
const loginController = require('./controllers/login');
const inventoryLocationController = require('./controllers/inventoryLocation');
const inventoryItemController = require('./controllers/inventoryItem');
const inventoryAssignmentController = require('./controllers/inventoryAssignment');

const app = express();

// connect to db
mongoose.connect(process.env.DB_CONNECTION_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
})
.then(() => {
    console.log('db connection sucess');
}).catch((err) => {
    console.error(err.message);
});

// middleware
app.use(morgan('common'));
app.use(helmet());
app.use(express.json());
app.use('/api', auth); // require auth for whole api

// routes
app.use('/api/inventoryAssignment', inventoryAssignmentController);
app.use('/api/ticket', ticketController);
app.use('/api/ticketCategory', ticketCategoryController);
app.use('/api/user', userController);
app.use('/api/inventoryLocation', inventoryLocationController);
app.use('/api/item', inventoryItemController);
app.use('/login',loginController);

// not found middleware
app.use((req, res) => {
    res.status(404).json({
        status: 'err',
        msg: 'resource not found',
        data: req.originalUrl
    });
});

// error middleware 
app.use((err, req, res, next) => {
    // set error response params
    const status = err.status ? err.status : 'err';
    const msg = err.msg ? err.msg : 'unknown server error';
    const data = err.data ? err.data : null;
    const debugMsg = err.debug ? err.debug : err;

    // set status code if not set already
    if (res.statusCode == 200) {
        res.status(500);
    }

    res.status(500).json({
        status: status,
        msg: msg,
        data: data,
        debug: debug.replace(debugMsg)
    });
});

app.listen(9000);