var express = require('express');
var router = express.Router();
var dbs = require('./db');
Person = dbs.person;


router.post('/', function(req, res, next) {
  let targetName = req.body.name;
  Person.findOne({name: targetName}, function(err, p){
    console.log(p);
    
    res.json(p);
 
  if(err) throw err;
  }); 
});

module.exports = router;
