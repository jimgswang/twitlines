#!/usr/bin/env node

var analyze = require('Sentimental').analyze,
    teams = require('../data/teams.json');

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
            console.log(tweetedTeam, tweet.text, tweet.user.location, tweet.coordinates, tweet.created_at);
        }
    }
});
