var express = require('express');
var router = express.Router();
var dbs = require('./db');
const Run = dbs.run;

var auth = require('./auth');
const decodeJWT = auth.decodeJWT; 


router.post('/', function(req, res, next) {
  let token = req.headers.authorization.split(' ')[1];
  let claims = decodeJWT(token);
  let targetName = claims.username; 

  

  Run.find({username: targetName}, function(err, p){
    console.log(p);
    
    res.json(p);
 
  if(err) throw err;
  }); 
});

module.exports = router;
