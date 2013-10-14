var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var tweetSchema = new Schema({
    team : String,
    text : String,
    rating : Number,
    location : String,
    coordinates : String
});

module.exports = mongoose.model('Tweet', tweetSchema);
