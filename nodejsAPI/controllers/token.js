const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/httpMsgs");
const userController = require("./user");
const jwt = require("jsonwebtoken");
const Parameter = require('../helpers/parameter');


exports.refreshToken = (req, res, next) => {
  const token = req.body.accesstoken;

  //get userid from JWT payload
  const decoded = jwt.verify(token, process.env.JwtSecretKey, {
    ignoreExpiration: true
  });

  const userId = decoded.userId;
  userController.userById(userId, function(data) {
    const user = data[0];
    const tokens = module.exports.generateTokens(user);

    //this saves the new refreshtoken to the db
    module.exports.saveRefreshToken(userId, tokens.refreshtoken);
    
    const newTokens = {
      accessToken: tokens.accesstoken,
      refreshExp: tokens.refreshExp
    };

    return msg.show200(req, res, newTokens, "Refreshed Succesfully");
  });
};

exports.saveRefreshToken = (id, refreshtoken) => {

  let params = [];
  params.push(new Parameter('id', 'Int' , id));
  params.push(new Parameter('token', 'NVarChar' , refreshtoken));

  db.executeSql(
    `UPDATE Users SET Refreshtoken=(@token) WHERE UserId=(@id)`,
    function(data, err) {
      if (err) {
        msg.show500(req, res, err);
      }
    }, params
  );
};

exports.generateVerificationToken = () => {
  return jwt.sign({
  },
    process.env.JwtVerificationKey,
    {
      expiresIn: 43200 //12 hours
    }
  );
}

exports.generateTokens = user => {
  const refreshExp = 691200; // 691200s = 8d
  const accessExp = 300; // 300s = 5m

  const accesstoken = jwt.sign(
    {
      email: user.Email,
      userId: user.UserId
    },
    process.env.JwtSecretKey,
    {
      //options
      expiresIn: accessExp
    }
  );

  const refreshtoken = jwt.sign(
    {
      email: user.Email,
      userId: user.UserId
    },
    process.env.JwtRefreshKey,
    {
      expiresIn: refreshExp
    }
  );

  return tokens = {
    accesstoken: accesstoken,
    accessExp: accessExp,
    refreshtoken: refreshtoken,
    refreshExp: refreshExp
  };
};
