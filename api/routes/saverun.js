const express = require('express');
const router = express.Router();
const dbs = require('./db');
const Run = dbs.run;

const auth = require('./auth');
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
      res.json({ message: "error: run not saved" });
    } 
    else {
      res.json({ message: "run saved" });
    }
  });
});

module.exports = router;