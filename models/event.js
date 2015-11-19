var mongoose =  require('mongoose');

var eventSchema = new mongoose.Schema({
    title:{type:String},
    eventdate:{type:Date},
    venue:{
        name:{type:String},
        address:{type:String}
    },
    created:{type:Date, default:Date.now}
});

var Event = mongoose.model('Event', eventSchema);

module.exports = {
    Event:Event
};