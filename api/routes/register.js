const express = require('express');
const router = express.Router();
const dbs = require('./db');
const bcrypt = require("bcrypt");

User = dbs.user;

router.post('/', (req, res, next) => {
  const newUser = new User({ 
      username: req.body.username, 
      password: bcrypt.hashSync(req.body.password, 12),
      email: req.body.email 
  });

  if(User.exists({ username: req.body.username })) {
    res.send("user already exists")
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

module.exports = router;