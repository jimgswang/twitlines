#!/usr/bin/env node

var request = require('request'),
    StringDecoder = require('string_decoder').StringDecoder,
    fs = require('fs'),
    settings = require('../settings').dev,
    cp = require('child_process'),
    child = cp.fork(__dirname + '/child.js'),
    teams = require('../data/teams.json');

var ntwitter = require('ntwitter');

var endpoint = 'https://stream.twitter.com/1.1/statuses/filter.json';
var endpoint2 = 'http://54.218.117.28:8080/';

var twit = new ntwitter( {
    consumer_secret : settings.twitterConsumerSecret,
    consumer_key : settings.twitterConsumerKey,
    access_token_key : settings.twitterAccessToken,
    access_token_secret : settings.twitterAccessTokenSecret
});

var oauth = {
    consumer_key : settings.twitterConsumerKey,
    consumer_secret : settings.twitterConsumerSecret,
    signature_method : "HMAC-SHA1",
    token : settings.twitterAccessToken,
    token_secret : settings.twitterAccessTokenSecret,
    version : "1.0"
};


var sendRequest = function() {
    var body = "track=twitter";
    var decoder = new StringDecoder('utf-8');
    var teamnames = teams.map(function(item) {
        return '#' + item.name;
    });

    var filters = teamnames.join(',');

    console.log(filters);
    request.post(
            { 
                uri : endpoint,
                form: { track: 'Seahawks'},
                oauth: oauth
            },
            function (err, res, body) {
                console.log("done");
            }
            )
            .on('data', function(chunk) {
                var str = decoder.write(chunk);
                if(str !== '\r\n') {
                    try {
                        var tweet = JSON.parse(str);
                        child.send(tweet);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                
            });
};
sendRequest();





/*
twit.verifyCredentials(function(err, data) {
    console.log("success?");
}).stream('statuses/filter' , {track : 'twitter' }, function(stream) {
    stream.on('data', function(data) {
        console.log(data.text);
    });
});
*/
