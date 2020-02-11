var express = require('express');
var router = express.Router();
var dbs = require('./db');
Person = dbs.person;

router.post('/', (req, res, next) => {
 
  let reqPerson = req.body;
  let newName = reqPerson.name;
  let newAge = reqPerson.age; 

  let newPerson = new Person({name: newName, age: newAge, favoriteFoods: ["pizza"] });  
})

module.exports = router;
