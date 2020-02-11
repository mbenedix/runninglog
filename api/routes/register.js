var express = require('express');
var router = express.Router();
var dbs = require('./db');
const bcrypt = require("bcrypt");

User = dbs.user;


router.post('/', (req, res, next) => {
 
  let newUser = new User({ 
      username: req.body.username, 
      password: bcrypt.hashSync(req.body.password, 12),
      email: req.body.email 
  });

    let foundUser = User.exists({ username: newUser.username });

    if(foundUser == true) {
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