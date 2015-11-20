/*
 This is the controller set up to handle this url: mydomain.com/links (in this sample, localhost:3000/links)
 It uses services/link-service.js to get all links on or after specified date
 and render with views/links/index.ejs template
 Note: call service with new Date('2015-12-01'), eg, to get all links on and after Dec 1, 2015
 */
var express = require('express');
var router = express.Router();
var linkService = require('../services/link-service');

router.get('/', function (req, res, next) {
    linkService.getLinks(function (err, links) {
        if (err) {
            console.log(err);
            return next(err);
        }
        var vm = {
            title: 'Links',
            links: links,
            logmsg: req.session.user ? 'Welcome, '+req.session.username : ''
        };
        return res.render('links/index', vm);
    })
});

module.exports = router;
