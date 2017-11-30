var mongoose = require('mongoose');
var MarketPlaceSchema = new mongoose.Schema({
   name: String,
   price: Number,
   purchases: {type: Number, default: 0},
});

MarketPlaceSchema.methods.purchase = function(cb) {
  this.purchases += 1;
  this.save(cb);
};
mongoose.model('MarketPlace', MarketPlaceSchema);
