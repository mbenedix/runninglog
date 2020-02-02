var express = require('express');
var router = express.Router();
var dbs = require('./db');
User = dbs.user;


router.post('/', (req, res, next) => {
 
  let newUser = new User({ 
      username: req.body.username, 
      password: bcrypt.hashSync(req.body.password, 12),
      email: req.body.email 
  });

    User.findOne({ email: newUser.email }, function(err, user) {
      if (err) {
        next(err);
      } else if (user) {
        res.send("user already exists!")
      } else {
        newUser.save(err => {
            if (err) {
              res.send("user registration failed");
            } else {
              next(null, user);
            }
          }
        )
      }
    })
  }, () => { res.redirect('localhost:3000/login'); }

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