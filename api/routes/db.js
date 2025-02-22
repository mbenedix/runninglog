const mongoose = require("mongoose");
const fs = require('fs');

//retrieves uri string from docker secret file
fs.readFile('/run/secrets/mongo_uri', (err, data) => { 
  if (err) throw err; 
  mongoose.connect(data.toString(), { useNewUrlParser: true, useUnifiedTopology: true });
}); 

const personSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number, 
  favoriteFoods: [String]
}, {versionKey: false});

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}, 
  email: {type: String, required: true}, 
}, {versionKey: false});

const runSchema = new mongoose.Schema({
  username: {type: String, required: true},
  date: {type: String, required: true},
  time: {type: Number, required: true}, 
  distance: {type: Number, required: true},
  runType: {type: String, required: true},
  //elevation: {type: String, required: false},
  //heartRate: {type: String, required: false} 
}, {versionKey: false});

const Person = mongoose.model("Person", personSchema);
const User = mongoose.model("User", userSchema);
const Run = mongoose.model("Run", runSchema);

module.exports.run = Run;
module.exports.person = Person;
module.exports.user = User; 