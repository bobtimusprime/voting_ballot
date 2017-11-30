var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('MarketPlace');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('voter.html', { root: 'public' });
});

/* GET admin page. */
router.get('/admin', function(req, res, next) {
  res.sendFile('admin.html', { root: 'public' });
});

/* Define paramaters for individual products */
/* Anytime that :product is put in the route it will run through here first*/
router.param('product', function(req, res, next, id) {
  var query = product.findById(id);
  query.exec(function (err, product){
    if (err) { return next(err); }
    if (!product) { return next(new Error("Can't find product")); }
    req.product = product;
    return next();
  });
});

/* GET  all products */
router.get('/products', function(req, res, next){
  Product.find(function(err, products){
    if(err) { return next(err); }
    res.json(products);
  });
});

/* GET single product */
router.get('/products/:product', function(req, res){
  console.log("inside get");
  res.json(req.product);
});

/* POST products to database */
router.post('/products', function(req, res, next){
  var product = new Product(req.body);
  product.save(function(err, product){
    if(err){ return next(err); }
    res.json(product)
  });
});

/* PUT vote for product */
//product.vote is definied as a method in models/MarketPlace
router.put('/products/:product/vote', function(req, res, next){
    req.product.vote(function(err, comment){
    if (err) { return next(err); }
   // console.log(product);
   // res.json(product)
    res.sendStatus(200);
  });
});

/*DELETE product from database */
router.delete('/products/:product', function(req, res) {
   //console.log('in delete');
   req.product.remove();
   res.sendStatus(200);
});

module.exports = router;
