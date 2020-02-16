var mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 


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
  time: {type: String, required: true}, 
  distance: {type: String, required: true},
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