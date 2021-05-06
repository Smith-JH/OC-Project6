//define the location of sauceSchema (from the models folder)
const Sauce = require('../models/sauce');
//define fs as a call to the node 'file system' package
const fs = require('fs');
const sauce = require('../models/sauce');


//POST new instance of sauce to the website
exports.createSauce = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);    //take stringified sauce and parse it into a JSON object
    //Create the new Sauce
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + "/images/" + req.file.filename,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    //save the new Sauce to the database, returns a promise - then for success or catch and send back error response
    sauce.save().then(() => {
        res.status(201).json({
            message: 'Sauce saved successfully!',
        });
    }).catch((error) => {
        res.status(400).json({
            error: error,
        });        
    });
};


//A GET route for a specific sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id,
    }).then((sauce) => {
        res.status(200).json(sauce);
    }).catch((error) => {
        res.status(404).json({
          error: error,
        });
    });
};


//PUT route to modify existing Sauces
exports.modifySauce = (req, res, next) => {
    //Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    //if image uploaded with the put request: capture it and update sauce imageURL
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {             
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        //sauce.remove({imageUrl});    <- need to remove the previous image, if the PUT modification replaces the user's image
        sauce = {
            _id: req.params.id,
            userId: req.body.sauce.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
            //likes: 0,
            //dislikes: 0,
            //usersLiked: [],
            //usersDisliked: [],
        }
    } else {
        sauce = {
            _id: req.params.id,
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            //imageUrl: req.body.imageUrl,      //removing this line just keeps the image that was there previously
            heat: req.body.heat,
            //likes: req.body.likes,
            //dislikes: req.body.dislikes,
            //usersLiked: req.body.usersLiked,
            //usersDisliked: req.body.usersDisliked,
        };
    }
    Sauce.updateOne({_id: req.params.id}, sauce)
    .then(() => {
        res.status(201).json({
            message: 'Sauce updated successfully!',
        });
    }).catch((error) => {
        res.status(400).json({
            error: error,
        });
    });
};


//DELETE route to remove a sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then((sauce) => {     //find in db
        const filename = sauce.imageUrl.split('/images/')[1];       
        fs.unlink('images/' + filename, () => {               //access file name (split form of the imageUlr) 
        Sauce.deleteOne({_id: req.params.id})                 //delete the file and the db entry 
            .then(() => {
                res.status(200).json({
                    message: 'Deleted!',
                });
            }).catch((error) => {
                res.status(400).json({
                    error: error,
                });
            });
        });
    });
};


//GET route for ALL sauces in DB
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then((sauces) => {
        res.status(200).json(sauces);
    }).catch((error) => {
        res.status(400).json({
            error: error,
        });
    });
};

//Like or Dislike sauce
exports.rateSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then((sauce) => {
        //like a sauce (and, if applicable, removes a dislike)
        if (req.body.like === 1  && !sauce.usersLiked.includes(req.body.userId)) {
            console.log(req.body.like);
            sauce.usersLiked.push(req.body.userId); 
            sauce.likes += 1;
        //dislike a sauce (and, if applicable, removes a like)    
        } else if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)) {  
            console.log(req.body.like);                     
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes += 1;
        //otherwise remove the likes and the userIds from the users liked/disliked
        } else {
            req.body.like = 0
            if (sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersLiked.remove(req.body.userId);
                sauce.likes += -1;
            }
            if (sauce.usersDisliked.includes(req.body.userId)) {
                sauce.usersDisliked.remove(req.body.userId);
                sauce.dislikes += -1;
            }
        }
        Sauce.updateOne({_id: req.params.id}, sauce)
        .then((sauce) => {
            res.status(201).json(sauce)
        }) .catch((error) => {
            res.status(400).json({
                error: error,
            });  
        });
    });
};