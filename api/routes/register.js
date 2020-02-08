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

  }
  );
  /*
  passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
    */
  /*
 
  newUser.save((err, p) => {
    if (err) return console.error(err);
    console.log(p.name + " saved to database brooo");
    //res.send(p.name + " saved to database brooo");
    res.json(p);
  })*/
  


module.exports = router;