/*
 This is the controller to handle these urls:
    - home page: mydomain.com (or in this sample, localhost:3000)
    - signup form mydomain.com/signup
    - login form mydomain.com/login
    - logout form mydomain.com/logout
 It renders the page with views/index.ejs template
 */
var
    express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    User = require('../models/user').User,
    eventService = require('../services/event-service');

router.get('/', function(req, res) {
    // show next 3 upcoming events with link to see more
    eventService.getEvents(new Date(), function (err, events) {
        if (err) {
            console.log(err);
            return next(err);
        }
        console.log(events)
        var vm = {
            title: 'Upcoming Events',
            events: events.slice(0,3),
            logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
        };
        return res.render('index', vm);
    })
});

// utility function to create a hashed password to store in mongo users collection
function hashPassword(pwd) {
    var pw = crypto.createHash('sha256').update(pwd).digest('base64').toString();
    return pw;
}

// if a session already exists for this user, redirect to the home page
// if not, display the signup form, passing on session.msg that was passed in
router.get('/signup', function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    }
    var vm = {
        title: "Sign up for an account at Eventlist",
        msg: req.session.msg,
        logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
    }
    res.render('signup', vm);
});

// handle data posted from signup forrm
router.post('/signup', function (req, res) {
    var user = new User({username: req.body.username});
    user.set('hashedpw', hashPassword(req.body.password));
    user.set('email', req.body.email);
    user.save(function (err) {
        if (err) {
            res.session.error = err;
            res.redirect('/signup');
        } else {
            req.session.user = user._id;
            req.session.username = user.username;
            req.session.msg = 'Authenticated as ' + user.username;
            res.redirect('/');
        }
    });
});

router.get('/login',  function(req, res){
    if(req.session.user){
        res.redirect('/');
    }
    var vm = {
        title:"Login",
        msg: req.session.msg,
        logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
    }
    res.render('login', vm);
});

router.post('/login', function (req, res) {
    User.findOne({username: req.body.username})
        .exec(function (err, user) {
            if (!user) {
                err = 'User Not Found.';
            } else if (user.hashedpw ===
                hashPassword(req.body.password.toString())) {
                req.session.regenerate(function () {
                    req.session.user = user.id;
                    req.session.username = user.username;
                    req.session.msg = 'Welcome, ' + user.username;
                    // can't append this '. <a href="users/logout">Logout</a>
                    res.redirect('/');
                });
            } else {
                err = 'Authentication failed.';
            }
            if (err) {
                req.session.regenerate(function () {
                    req.session.msg = err;
                    res.redirect('/login');
                });
            }
        });
});

router.get('/logout', function(req, res){
    req.session.destroy(function(){
        res.redirect('/login');
    })
});

// don't need to load events before calling because that will be done by angular thru an api call in app.js
router.get('/admin', function(req, res) {
    if (req.session.user) {
        //res.sendFile('../public/admin.ejs'); // load the single view file (angular will handle the page changes on the front-end)
        var vm = {
            title: 'Events Admin',
            logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
        };
        return res.render('admin', vm);
    } else {
        req.session.msg = 'Login to access this page';
        res.redirect('/login');
    }
});

module.exports = router;
