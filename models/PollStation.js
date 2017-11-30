var mongoose = require('mongoose');
var PollingSchema = new mongoose.Schema({
   firstName: String,
   lastName: String,
   votes: {type: Number, default: 0},
});

PollingSchema.methods.vote = function(cb) {
  this.votes += 1;
  this.save(cb);
};
mongoose.model('PollStation', PollingSchema);
