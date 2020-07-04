
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
app.use(helmet())
app.use(express.json());
app.use('/api', auth); // require auth for whole api

// routes
ticketController.bind(app, '/api/ticket');
ticketCategoryController.bind(app, '/api/ticketCategory');
userController.bind(app, '/api/user');
inventoryLocationController.bind(app, '/api/inventoryLocation');
inventoryItemController.bind(app, '/api/item');

// speical routes .. FIXME: fix these
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
    res.status(500).json({
        status: 'err',
        msg: 'unknown server error',
        debug: debug.replace(err)
    });
});

app.listen(9000);