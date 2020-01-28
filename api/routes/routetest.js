var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("called");
  res.redirect("http://localhost:3000/testroute.html");
});

module.exports = router;
