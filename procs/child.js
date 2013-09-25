#!/usr/bin/env node

var analyze = require('Sentimental').analyze;

process.on('message', function(tweet) {
    console.log('child', tweet.text, tweet.user.location, tweet.coordinates, tweet.created_at,  analyze(tweet.text).score);
});
