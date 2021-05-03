//mongoDB user password: 6vAmzP47smNJTLL
//mongoDB connection: mongodb+srv://Jack:<password>@cluster0.srpw4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

//import express for buiding the express app
const express = require('express');
//import body parser to extract JSON object from POST request coming from website
const bodyParser = require('body-parser');
//import mongoose to apply schema structure to the mongoDB
const mongoose = require('mongoose');
//import the path package
const path = require('path');

//defines the location of all our routes
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://Jack:6vAmzP47smNJTLL@cluster0.srpw4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });


//middleware to deal with CORS errors by applying headers allowing all requests listed:
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//set bodyParser's json function as global middleware for the app
app.use(bodyParser.json());

//
app.use('/images', express.static(path.join(__dirname, 'images')));

//where to look for the sauce routes
app.use('/api/sauces', sauceRoutes);
//where to look for authentication routes
app.use('/api/auth', userRoutes);

module.exports = app;