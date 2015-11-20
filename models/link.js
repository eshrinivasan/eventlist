var mongoose =  require('mongoose');

var linkSchema = new mongoose.Schema({
    url:{type:String},
    descrip:{type:String},
    created:{type:Date, default:Date.now}
});

var Link = mongoose.model('Link', linkSchema);

module.exports = {
    Link:Link
};