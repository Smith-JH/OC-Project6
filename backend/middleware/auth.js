//import json web token
const jwt = require('jsonwebtoken');

//json web token middleware wrapped in try/catch block to catch errors
module.exports = (req, res, next) => {
    try {
        //extract token from request (without 'bearer' keyword) using 2nd element of header, split around the space
        const token = req.headers.authorization.split(' ')[1];
        //verify the token, requires it to be decoded with the random string used to encode it (see controllers/user)
        const decodedToken = jwt.verify(token, 'RANDOM-TOKEN-83f34fdbds945j-054jfsd-3jedf5');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {  //check user ID if there is on in the request body - fail if not the same
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};