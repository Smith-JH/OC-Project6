//Import Express to this page & create a router
const express = require('express');
const router = express.Router();


//Import the user controller
const userCtrl = require('../controllers/user');


//Create POST routes for sign up and login - importing the controller for each:
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//export the user router - make it available to the app.js file
module.exports = router;