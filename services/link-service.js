var Link = require('../models/link').Link;

// return links after and including startdate
exports.getLinks = function(next) {
    Link
        .find()
        .sort('descrip')
        .exec(function(err, links) {
            next(err, links);
        });
};

exports.getLink = function(id, next) {
    Link.findById(id, function(err, user) {
        next(err, user);
    })
};

exports.deleteLink = function(id, next) {
    Link
        .findOne({ _id: id})
        .exec(function(err, link) {
            if(link) {
                link.remove(function(err) {
                    if (err) {
                        return next(err);
                    }
                })
            }
        });
        next(null);
}

exports.addLink = function(link, next) {
    var newLink = new Link({
        url: link.url,
        descrip: link.descrip
    });

    newLink.save(function(err, link) {
        if (err) {
            return next(err);
        }
        next(null, link);
    });
};


// find the first link with the string specified by titlestr anywhere in its title and
// pass it (or an error) to next
exports.findLink = function(str, next) {
    Link.findOne({descrip: '/' + str + '/'}, function(err, link) {
        next(err, link);
    })
};

// find all links with the string specified by titlestr anywhere in its title and
// pass them (or an error) to next
exports.findLinks = function(str, next) {
    Link.find({descrip: '/' + str + '/'}, function(err, links) {
        next(err, links);
    });
};

