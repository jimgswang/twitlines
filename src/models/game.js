var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var gameSchema = new Schema({ 
    homeTeam: String,
    awayTeam: String,
    gameTime: Date,
    odds: [{ line: Number, timeChecked: Date, _id: Schema.Types.ObjectId }]
});

gameSchema.methods.addOdds = function(newOdds) {
    this.odds.push(newOdds);
}

mongoose.model('Game', gameSchema);
