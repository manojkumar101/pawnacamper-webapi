const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
global.rootDir = path.resolve(__dirname);
const fileUpload = require('express-fileupload');
// const { errorHandlerMiddleware, errorHandler } = require('./common/error');
const { statusCode } = require('./constants');
// view engine setup
app.set('views', path.join(__dirname, 'views'));



/**
 * Parse incoming request bodies in a middleware before your handlers,
 * available under the req.body property.
 */

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Parse Cookie header and populate req.cookies
app.use(cookieParser());


app.use(fileUpload({}));

var corsOptions = {
  origin:'*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));


// API Calling

app.use('/api', require('./api'));

app.use((req, res, next) => {
  next(createError(404));
});


// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.statusCode || statusCode.internal_server_error).json({
    message: error.message,
    data: typeof error.data !== 'undefined' ? error.data : {},
  });
  
});


process.on('uncaughtException', function (err) {
  console.log(err);
  errorHandler(err);
});


module.exports = app;
