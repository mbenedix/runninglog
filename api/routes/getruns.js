const express = require('express');
const dbs = require('./db');
const auth = require('./auth');

const router = express.Router();
const Run = dbs.run;
const decodeJWT = auth.decodeJWT; 

router.post('/', function(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  const claims = decodeJWT(token);
  const targetName = claims.username; 

  Run.find({username: targetName}, function(err, p){
    
    res.json(p);
 
    if(err) throw err;
  }); 
});

module.exports = router;
