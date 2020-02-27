const express = require('express');
const dbs = require('./db');
const auth = require('./auth');

const router = express.Router();
const Run = dbs.run;
const decodeJWT = auth.decodeJWT; 

router.post('/', function(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  const claims = decodeJWT(token);

  let data = req.body;
  data.username = claims.username; 
  const newRun = new Run(data); 

  newRun.save(err => {
    if (err) {
      console.log(err);
      res.json({ message: "Error: run not saved" });
    } 
    else {
      res.json({ message: "Run saved" });
    }
  });
});

module.exports = router;