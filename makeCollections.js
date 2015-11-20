db = connect("localhost/eventlist");
db.getCollectionNames().forEach(function (collection) {
    print(collection);
});

// copy the following and paste into mongo to drop and re-create events collection
event_coll = db.getCollection('events');
event_coll.drop();

db.createCollection("events");
event_coll.getCollection('events');
event_coll.insert({
    title:'Secret Strategies of a Savvy Entrepreneur',
    eventdate: new Date('2015-12-10'),
    venue: {
        'name': 'MWBC',
        'address': '51 Monroe St #20, Rockville MD 20850'
    },
    created: new Date()
});
event_coll.insert({
    title:'ABCs of Starting a Business-Frederick County',
    eventdate: new Date('2015-12-07'),
    venue: {
        'name': 'Frederick County Govt Office',
        'address': '118 North Market Street, Frederick, MD 21701'
    },
    created: new Date()
});
event_coll.insert({
    title:'Harness the Power of Mobile Marketing',
    eventdate: new Date('2015-11-19'),
    venue: {
        'name': 'MWBC',
        'address': '51 Monroe St #20, Rockville MD 20850'
    },
    created: new Date()
});
event_coll.insert({
    title:'Orientation to Small Business Resources',
    eventdate: new Date('2015-12-03'),
    venue: {
        'name': 'MWBC',
        'address': '51 Monroe St #20, Rockville MD 20850'
    },
    created: new Date()
});

user_coll = db.getCollection('events');
user_coll.drop();