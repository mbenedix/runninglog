const express = require('express');
const dbs = require('./db');
const bcrypt = require("bcrypt");

const router = express.Router();
const User = dbs.user;

router.post('/', (req, res, next) => {
  const newUser = new User({ 
      username: req.body.username, 
      password: bcrypt.hashSync(req.body.password, 12),
      email: req.body.email 
  });
  
  User.exists({ username: req.body.username }, function (err, exists) {
    if (err) {
      res.send("user registration failed");
    }

    else if(exists) {
      res.send("user already exists");
    }
    else {
      newUser.save(err => {
        if (err) {
          res.send("user registration failed");
        } 
        else {
          res.send("successful user registration");
        }
      });
    } 
  });
});

module.exports = router;