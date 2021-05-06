//import mongoose to apply schema structure to the mongoDB
const mongoose = require('mongoose');
//import mongoose unique validator
const uniqueValidator = require('mongoose-unique-validator');       //sets the username as a unique validation sequence


//make a schema for users
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

//use mongoose unique validator
userSchema.plugin(uniqueValidator);

//export the user model
module.exports = mongoose.model('User', userSchema);