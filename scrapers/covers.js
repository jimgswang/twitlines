#!/usr/bin/env node

var nodeio = require('node.io');

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
                    var teams = $(this).find('.team_away').filter(':first').text().trim();
                    var homeTeam = $(this).find('.team_home').filter(':first').text().trim();
                    var coversOdds = $(this).find('.covers_bottom').text().trim();

                    var odds = $(this).find('.offshore').text().split('\r\n');

                    var result = {};
                    result.odds = [];

                    for(var i = 0; i < odds.length; i ++) {
                          odds[i] = odds[i].replace(/\s/g, '');
                          if(odds[i] !== '') {
                              result.odds.push(odds[i]);
                          }
                    }

                    result.odds.push(coversOdds);

                    result.teams = teams + homeTeam;
                    results.push(result);
                });
                this.emit(results);
            }
        });
    }
});

nodeio.start(scrapeJob, function() { 
    console.log('finished');
});
