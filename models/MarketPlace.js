var mongoose = require('mongoose');
var PollingSchema = new mongoose.Schema({
   firstName: String,
   price: Number,
   purchases: {type: Number, default: 0},
});

PollingSchema.methods.purchase = function(cb) {
  this.purchases += 1;
  this.save(cb);
};
mongoose.model('MarketPlace', PollingSchema);
