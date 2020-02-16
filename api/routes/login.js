var express = require('express');
var router = express.Router();
var auth = require('./auth');
const genJWT = auth.generateJWT; 
const JSRSASign = require("jsrsasign");

const bcrypt = require("bcrypt");

var dbs = require('./db');
User = dbs.user;

router.post('/', (req, res, next) => {
  const [username, password] = [req.body.username, req.body.password];
  User.findOne({ username: username }, function (err, user) {
    console.log('User '+ username +' attempted to log in.');
    if (err) { res.send(err); return;}
    if (!user) { res.send("1"); return; } //username not found
    if (!bcrypt.compareSync(password, user.password)) { res.send ("2"); return; } //incorrect password
    
    res.send(genJWT({ username: username })); //successful 
    });
});

module.exports = router;