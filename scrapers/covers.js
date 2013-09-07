#!/usr/bin/env node

var nodeio = require('node.io'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    async = require('async');

mongoose.connect('mongodb://localhost/dev');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error : '));

require('./../src/models/game.js');
var Game = mongoose.model('Game');

var url = 'www.covers.com/odds/football/nfl-spreads.aspx';
var scrapeJob  = new nodeio.Job({ jsdom: true } , {
    input: false,
    run: function() {
        this.getHtml(url, function(err,$) {
            if (err) {
                console.log('error');
                this.exit(err);
            }
            else { 
                var rows = $('.bg_row');

                var results = [];
                var now = new Date();

                rows.each(function(row) {
                    var teams = $(this).find('.team_away').filter(':first').text().trim();
                    var homeTeam = $(this).find('.team_home').filter(':first').text().trim().replace('@', '');

                    var odds = $(this).find('.offshore').text().split('\r\n');

                    // remove white space
                    odds = _.filter(odds, function(item) {
                        return item.replace(/\s/g, '') !== '';
                    });

                    // Replace all occurances of pk as odds of 0
                    odds = _.map(odds, function(item) {
                        return item.trim() === 'pk' ? 0 : item.trim();
                    });

                    var length = odds.length;
                    odds = _.reduce(odds, function(memo, item) {
                        return memo + parseFloat(item);
                    }, 0);

                    var game = {};

                    odds = odds/length;

                    game.odds = {line: odds, timeChecked: now };
                    game.homeTeam = homeTeam;
                    game.awayTeam = teams;
                    results.push(game);
                });
                this.emit(results);
            }
        });
    }
});

var makeGameSaveFn = function(item) {
    return function (callback){
         Game.findOne({homeTeam :item.homeTeam, awayTeam: item.awayTeam }, function(err, game) {
            if(!game) game = new Game();

            game.homeTeam = item.homeTeam;
            game.awayTeam = item.awayTeam;
            game.addOdds(item.odds);
            game.save();
            callback(null, 0);
         });
    }
};

nodeio.start(scrapeJob, function(err, data) { 
    var saves = _.map(data, makeGameSaveFn);
    
    async.parallel(saves, function(err, results) {
        db.close();
        console.log('finished');
    });
}, true);
