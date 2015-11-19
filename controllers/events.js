/*
 This is the controller set up to handle this url: mydomain.com/events (in this sample, localhost:3000/events)
 It uses services/event-service.js to get all events on or after specified date
 and render with views/events/index.ejs template
 Note: call service with new Date('2015-12-01'), eg, to get all events on and after Dec 1, 2015
 */
var express = require('express');
var router = express.Router();
var eventService = require('../services/event-service');

router.get('/', function (req, res, next) {
    eventService.getEvents(new Date(), function (err, events) {
        if (err) {
            console.log(err);
            return next(err);
        }
        var vm = {
            title: 'Events',
            data: events,
            logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
        };
        return res.render('events/index', vm);
    })
});

module.exports = router;
