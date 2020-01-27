var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 


const personSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number, 
  favoriteFoods: [String]
}, {versionKey: false});



const Person = mongoose.model("Person", personSchema);

router.get('/', function(req, res, next) {
  Person.findOne({name: "matt benedix"}, function(err, p){
    console.log(p);
    res.json(p);
    if(err) throw err;
  });
  
});

module.exports = router;
