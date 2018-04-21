const jwt = require('jsonwebtoken');
const msg = require('../db/httpMsgs');
const users = require('../controllers/user');

//read more: https://jwt.io/

module.exports = (req, res, next) => {
    //token is sent as "Bearer  xxxxx" so we split it to retrieve token
    const token = req.headers.authorization.split(' ');
    try  {
    
    //verify will throw an exception if it has expired - else proceed
    jwt.verify(token[1],  process.env.JwtSecretKey) 
    next();
    }  
     catch (error) {
        //if accesstoken has expired we fetch the user's refreshtoken and if that is valid we generate new tokens
        if(error["name"] == 'TokenExpiredError') {
            
            //extract user id from the JWT payload
             const decoded = jwt.verify(token[1],  process.env.JwtSecretKey, {
                ignoreExpiration: true
            })

            const userId = decoded.userId;
            users.userById(userId, function(data) {
                const user = data[0];
                const refreshtoken = user.Refreshtoken;
              
                try {              
                    //check if expired else we generate new tokens
                    jwt.verify(refreshtoken,  process.env.JwtRefreshKey);
                   
                    //inform the client that the accesstoken needs to be refreshed
                    return msg.show419(req, res);
                    
                } catch(error) {
                    //if the refreshtoken has expired too the user needs to login
                    if(error["name"] == 'TokenExpiredError') {
                        return msg.show401(req, res, next); 
                    }
                }
            }, req, res);          
        } 
    }
}