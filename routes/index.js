var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Candidate = mongoose.model('PollStation');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('voter.html', { root: 'public' });
});

/* GET admin page. */
router.get('/admin', function(req, res, next) {
  res.sendFile('admin.html', { root: 'public' });
});

/* Define paramaters for individual candidates */
/* Anytime that :candidate is put in the route it will run through here first*/
router.param('candidate', function(req, res, next, id) {
  var query = Candidate.findById(id);
  query.exec(function (err, candidate){
    if (err) { return next(err); }
    if (!candidate) { return next(new Error("Can't find Candidate")); }
    req.candidate = candidate;
    return next();
  });
});

/* GET  all candidates */
router.get('/candidates', function(req, res, next){
  Candidate.find(function(err, candidates){
    if(err) { return next(err); }
    res.json(candidates);
  });
});

/* GET single candidate */
router.get('/candidates/:candidate', function(req, res){
  console.log("inside get");
  res.json(req.candidate);
});

/* POST candidates to database */
router.post('/candidates', function(req, res, next){
  var candidate = new Candidate(req.body);
  candidate.save(function(err, candidate){
    if(err){ return next(err); }
    res.json(candidate)
  });
});

/* PUT vote for candidate */
//candidate.vote is definied as a method in models/PollStation
router.put('/candidates/:candidate/vote', function(req, res, next){
    req.candidate.vote(function(err, comment){
    if (err) { return next(err); }
   // console.log(candidate);
   // res.json(candidate)
    res.sendStatus(200);
  });
});

/*DELETE candidate from database */
router.delete('/candidates/:candidate', function(req, res) {
   //console.log('in delete');
   req.candidate.remove();
   res.sendStatus(200);
});

module.exports = router;
