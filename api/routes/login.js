var express = require('express');
var router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");

var dbs = require('./db');
User = dbs.user;

passport.serializeUser((user, done) => {
  done(null, user._id);
});
    
passport.deserializeUser((id, done) => {
  User.findOne(
  { _id: new ObjectID(id) },
    (err, doc) => {
      done(null, doc);
    }
  );  
});
  
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
    console.log('User '+ username +' attempted to log in.');
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
    return done(null, user);
    });
  }
));

passport.authenticate('local', { failureRedirect: '/' }),
(req, res, next) => {
  res.redirect('/profile');
}

 