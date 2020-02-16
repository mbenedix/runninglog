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

  let newRun = req.body;
  newRun.username = targetName; 

  newRun.save(err => {
    if (err) {
      res.send("error: run not saved");
    } 
    else {
      res.send("run saved");
    }
  });

});

module.exports = router;