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

  let data = req.body;
  data.username = targetName; 
  let newRun = new Run(data); 

  //console.log(newRun);

  newRun.save(err => {
    if (err) {
      res.json({ message: "error: run not saved" });
    } 
    else {
      res.json({ message: "run saved" });
    }
  });

});

module.exports = router;