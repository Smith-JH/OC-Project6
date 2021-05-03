//Import Express to this page & create a router
const express = require('express');
const router = express.Router();

//link to authentication middleware
const auth = require('../middleware/auth');
//link to multer middleware for saving images
const multer = require('../middleware/multer-config');

//link to controllers page
const sauceCtrl = require('../controllers/sauces');

//call the sauce controller.js page to where the logic for the following requests is held:
router.get('/', auth, sauceCtrl.getAllSauces);          //GET route for all sauces in the DB
router.post('/', auth, multer, sauceCtrl.createSauce);        //POST route for a new sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);        //GET route for a specific sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);      //PUT route to modify existing sauces   
router.delete('/:id', auth, sauceCtrl.deleteSauce);     //DELETE route to remove a sauce
router.post('/:id/like', auth, sauceCtrl.rateSauce);     //Adds/removes user rating for sauces


//export the router - make it available to the app.js file
module.exports = router;