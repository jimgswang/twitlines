var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var gameSchema = new Schema({ 
    homeTeam: String,
    awayTeam: String,
    gameTime: Date,
    odds: [{ line: Number, timeChecked: Date, }]
});

mongoose.model('Game', gameSchema);
