var express = require('express');
var router = express.Router();
var dbs = require('./db');
Person = dbs.person;

/*
router.get('/', function(req, res, next) {
  Person.findOne({name: "matt benedix"}, function(err, p){
    console.log(p);
    res.json(p);
    if(err) throw err;
  });
  
});*/

router.post('/', (req, res, next) => {
 
  let reqPerson = req.body;
  let newName = reqPerson.name;
  let newAge = reqPerson.age; 

  let newPerson = new Person({name: newName, age: newAge, favoriteFoods: ["pizza"] });

  newPerson.save((err, p) => {
    if (err) return console.error(err);
    console.log(p.name + " saved to database brooo");
    //res.send(p.name + " saved to database brooo");
    res.json(p);
  })
  
})

module.exports = router;
