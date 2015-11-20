// assign the output of required dependendent modules to local variables:

// framework for building app
var express = require('express');
// to create paths to views and static folders based on __dirname (location of this script)
var path = require('path');
// to parse http request and populate req.cookies with an object keyed by passed cookie names
var cookieParser = require('cookie-parser');
// to convert request stream into objects that can be accessed with req.body in middleware fcns
var bodyParser = require('body-parser');
// to create req.session (used in this sample for authenticating a user)
var expressSession = require('express-session');
// for saving sessions in mongo (https://github.com/kcbanner/connect-mongo/tree/v0.x)
var MongoStore = require('connect-mongo')({session: expressSession});
// for accessing mongo collections via schema and queries
var mongoose = require('mongoose');

// define url for database connection (default port is 27017)
var conn = mongoose.connect('mongodb://localhost/eventlist');
//var conn = mongoose.connect('mongodb://testuser:hamlet@ds057224.mongolab.com:57224/heroku_d0sdrhbp');

// initialize the application
var app = express();

// specify the path to the html templates
app.set('views', path.join(__dirname, 'views'));
// specify the template engine to use (ejs)
app.set('view engine', 'ejs');

// set up body parser to get json data or urlencoded data and put it into the req.body object used by middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// initialize cookie parser (which will create req.cookies)
app.use(cookieParser());

// set up for session-based authentication (commented out code is from Dayley book)
app.use(expressSession({
    secret: 'THISISTHEBIGSECRET',
    cookie: {maxAge: 60 * 60 * 1000},
    /*
     store: new mongoStore({
     db: mongoose.connection.db,
     collection: 'sessions'
     })
     */
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// define path to files that are accessible to the site visitor via browser url
//app.use(express.static(path.join(__dirname, './public')));

// after gulp concat/minification and file move:
app.use(express.static(path.join(__dirname, './assets')));

// set up routes to controllers for each section of the website
app.use('/', require('./controllers/index'));
app.use('/users', require('./controllers/users'));
app.use('/events', require('./controllers/events'));
app.use('/api', require('./controllers/api/index'));
app.use('/links', require('./controllers/links'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
