//import and define a bcrypt constant for encrypting passwords
const bcrypt = require('bcrypt');
//import json web token
const jwt = require('jsonwebtoken');
//import user models
const User = require('../models/user');


//implement signup function:
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {                           //call the bcrypt 'hash' fn on password & salt it 10 times
            const user = new User({
                email: req.body.email,
                password: hash
            });
        user.save().then(() => {                    //save this to DB & fulfil promise or catch error
            res.status(201).json({                  //201 success = resource created
                message: 'User added successfully!'
            });
        })
        .catch((error) => {
            res.status(500).json({                  //500 error = server error
                error: error
            });
        });
    });
};

//implement login function
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })         //check if that user exists
    .then((user) => {
        if (!user) {                                //if that user doesn't exist - send 401 error
            return res.status(401).json({           //401 error = authentication failed    
            error: new Error('User not found!')
            });
        } bcrypt.compare(req.body.password, user.password)  //use bcrypt to compare entered password with hashed password in DB
        .then((valid) => {
            if (!valid) {
                return res.status(401).json({
                error: new Error('Incorrect password!')
                });                                     //By this point, user exists and password is correct
            }                                       
            const token = jwt.sign(          //use jwt to create a json web token called "token"
                { userId: user._id },        //pass the jwt the user id
                'RANDOM-TOKEN-83f34fdbds945j-054jfsd-3jedf5',       //apply a random token string to the token
                { expiresIn: '24h' });
            res.status(200).json({           // 200 = successful request: return userID & authentication token
                userId: user._id,
                token: token
            });
        }).catch((error) => {               //error message for if bcrypt fails
            res.status(500).json({          //500 error = server error
                error: error
            });
        });
    }).catch((error) => {                  //error message for mongoose / mongoDB fail
        res.status(500).json({
            error: error
        });
    });
}