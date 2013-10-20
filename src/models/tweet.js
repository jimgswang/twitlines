var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var tweetSchema = new Schema({
    team : String,
    text : String,
    rating : Number,
    location : String,
    coordinates : String,
    date : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tweet', tweetSchema);
