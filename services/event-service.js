var Event = require('../models/event').Event;

// return events after and including startdate
exports.getEvents = function(startdate, next) {
    startdate = typeof startdate !== 'undefined' ? startdate : newDate();
    Event
        .find({eventdate: {"$gte": startdate-24*60*60*1000}})
        .sort('eventdate')
        .exec(function(err, events) {
            next(err, events);
        });
};

exports.getEvent = function(id, next) {
    Event.findById(id, function(err, user) {
        next(err, user);
    })
};

exports.deleteEvent = function(id, next) {
    Event
        .findOne({ _id: id})
        .exec(function(err, event) {
            if(event) {
                event.remove(function(err) {
                    if (err) {
                        return next(err);
                    }
                })
            }
        });
        next(null);
}

exports.addEvent = function(event, next) {
    var newEvent = new Event({
        title: event.title,
        eventdate: event.eventdate,
        venue: {
            name: event.venue.name,
            address: event.venue.address
        }
    });

    newEvent.save(function(err, event) {
        if (err) {
            return next(err);
        }
        next(null, event);
    });
};


// find the first event with the string specified by titlestr anywhere in its title and
// pass it (or an error) to next
exports.findEvent = function(titlestr, next) {
    Event.findOne({title: '/' + titlestr + '/'}, function(err, event) {
        next(err, event);
    })
};

// find all events with the string specified by titlestr anywhere in its title and
// pass them (or an error) to next
exports.findEvents = function(titlestr, next) {
    Event.find({title: '/' + titlestr + '/'}, function(err, events) {
        next(err, events);
    });
};

