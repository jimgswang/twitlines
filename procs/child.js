#!/usr/bin/env node

var analyze = require('Sentimental').analyze,
    teams = require('../data/teams.json'),
    mongoose = require('mongoose'),
    Tweet = require('./../src/models/tweet.js');

mongoose.connect('mongodb://localhost/dev');

var db = mongoose.connection;

var teamnames = teams.map(function(item) {
    return item.name;
});

process.on('message', function(tweet) {
    var score = analyze(tweet.text).score;
    if(score != 0)
    {
        var tweetedTeam = '';
        
        for(var i = 0; i < teamnames.length; i++) {
            if(tweet.text.indexOf(teamnames[i]) > -1 ) {
                tweetedTeam = teamnames[i];
                break;
            }
        }

        if(tweetedTeam !== '') {
            var nTweet = new Tweet({ team: tweetedTeam, text : tweet.text, location : tweet.user.location, coordinates : tweet.coordinates, date : tweet.created_at, rating: score });

            nTweet.save();
        }
    }
});
