#!/usr/bin/env node

var nodeio = require('node.io'),
    mongoose = require('mongoose'),
    _ = require('underscore');

mongoose.connect('mongodb://localhost/dev');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error : '));
db.once('open', function() {
    console.log('yay');
});

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

                rows.each(function(row) {
                    var game = new Game();
                    var teams = $(this).find('.team_away').filter(':first').text().trim();
                    var homeTeam = $(this).find('.team_home').filter(':first').text().trim();
                    var coversOdds = $(this).find('.covers_bottom').text().trim();

                    var odds = $(this).find('.offshore').text().split('\r\n');

                    var result = {};
                    result.odds = [];

                    for(var i = 0; i < odds.length; i ++) {
                          odds[i] = odds[i].replace(/\s/g, '');
                          if(odds[i] !== '') {
                              if( odds[i] === 'pk')
                                  odds[i] = 0;
                              
                              game.odds.push({ line: odds[i], timeChecked: new Date() }); 
                          }
                    }


                    result.odds.push(coversOdds);

                    game.homeTeam = homeTeam;
                    game.awayTeam = teams;
                    result.game = game;
                    results.push(result);
                    game.save();
                });
                this.emit(results);
            }
        });
    }
});

nodeio.start(scrapeJob, function() { 
    console.log('finished');
    db.close();
});
