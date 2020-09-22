
// TODO: use cors

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const debug = require('./helper/debug');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// import environment variables
require('dotenv').config();

// import middleware
const { auth } = require('./auth/auth');
const testAuth = require('./auth/aadAuth.js');

// import controllers
const ticketController = require('./controllers/ticket');
const ticketCategoryController = require('./controllers/ticketCategory');
const userController = require('./controllers/user');
const loginController = require('./controllers/login');
const inventoryLocationController = require('./controllers/inventoryLocation');
const inventoryItemController = require('./controllers/inventoryItem');
const inventoryAssignmentController = require('./controllers/inventoryAssignment');
const inventoryAssetController = require('./controllers/inventoryAsset');
const organizationController = require('./controllers/organization');
const orderController = require('./controllers/order');
const metaController = require('./controllers/meta');

const app = express();

// connect to db
mongoose.connect(process.env.DB_CONNECTION_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
})
.then(() => {
    console.log('db connection sucess');
})
.catch((err) => {
    console.error(err.message);
});

// middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(morgan('common'));
app.use(helmet());
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

// routes
app.use('/api/login', loginController);
app.use('/api/ticket', ticketController);
app.use('/api/ticket/category', ticketCategoryController);
app.use('/api/user', userController);
app.use('/api/inventory/item', inventoryItemController);
app.use('/api/inventory/asset', inventoryAssetController);
app.use('/api/inventory/assignment', inventoryAssignmentController);
app.use('/api/inventory/location', inventoryLocationController);
app.use('/api/organization', organizationController);
app.use('/api/inventory/order', orderController);
app.use('/api/meta', metaController);

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
    const friendlyMsg = err.friendlyMsg ? err.friendlyMsg : null;

    console.log(err);

    // set status code if not set already
    if (res.statusCode == 200) {
        res.status(500);
    }

    res.json({
        status: status,
        msg: msg,
        friendlyMsg: friendlyMsg,
        data: data,
        debug: debug.replace(debugMsg)
    });
});

app.listen(9000);