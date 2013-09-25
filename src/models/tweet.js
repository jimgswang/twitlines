var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var tweetSchema = new Schema({
    team : String,
    text : String,
    rating : Number,
    location : String,
    coordinates : String
});

mongoose.model('Tweet', tweetSchema);
