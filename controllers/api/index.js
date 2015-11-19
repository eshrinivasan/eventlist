/*
 This is the controller set up to handle this url: mydomain.com/api/events
 It is used to pass back a json array of events to whoever is calling it (maybe a local angular app, or an outside caller)
 Like controllers/events.js, it uses services/event-service.js to get all events after the current date
 */
var express = require('express');
var router = express.Router();
var eventService = require('../../services/event-service');

router.get('/events', function (req, res, next) {
    eventService.getEvents(new Date(), function (err, events) {
        if (err) {
            return next(err)
        }
        res.status(201).json(events)
    })
});

router.post('/events/delete', function (req, res, next) {
    eventService.deleteEvent(req.body.id, function (err, event) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.status(201).json(event)
    })
})

router.post('/events', function (req, res, next) {
    eventService.addEvent(req.body.event, function (err, event) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.status(201).json(event)
    })
})

module.exports = router;
