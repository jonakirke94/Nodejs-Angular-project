const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/httpMsgs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenController = require("./token");
const Parameter = require('../helpers/parameter');


exports.user_signup = (req, res, next) => {
  const email = req.body.email;

  //check if email exists
  userByEmail(email, function(data) {

      if(data.recordsets[0].length > 0) {
        return msg.show409(req, res, "Email exists");
      }

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          msg.show500(req, res, err);
        } else {

          let params = [];
          params.push(new Parameter('email', 'NVarChar' , email));
          params.push(new Parameter('hash', 'NVarChar' , hash));
      
          db.executeSql(
            `INSERT INTO Users VALUES(null, (@email), (@hash), null, 0)`, params,
            function(data, err) {
              if (err) {
                msg.show500(req, res, err);
              } else {
                msg.show201(req, res, req.body);
              }
            }
          );
        }
      });
  })

  
};

exports.userById = (id, callback) => {

  let params = [];
  params.push(new Parameter('id', 'Int' , id));

  db.executeSql(`SELECT * FROM Users WHERE UserId = (@id))`, function(
    data,
    err
  ) {
    if (err) {
      msg.show500(req, res, err);
    } else {
      callback(data.recordset);
    }
  }, params);
};

function userByEmail(email, callback) {

  let params = [];
  params.push(new Parameter('email', 'NVarChar' , email));

  db.executeSql(`SELECT * FROM Users WHERE Email= (@email)`, params, function(
    data,
    err
  ) {
    if (err) {
      msg.show500(req, res, err);
    } else {
      callback(data);
    }
  });
};

exports.user_login = (req, res, next) => {
  //find user by email
  const email = req.body.email;
  userByEmail(email, function(data) {
    const user = data.recordset[0];

    //check if user was found
    if (typeof user == "undefined") {
      return msg.show401(req, res, next);
    }

    //check if password
    bcrypt.compare(req.body.password, user.Password, (err, result) => {
      if (err) {
        return msg.show500(req, res, err);
      }
      if (result) {
        const tokens = tokenController.generateTokens(user);
        
        //save refreshtoken in database
        tokenController.saveRefreshToken(user.UserId, tokens.refreshtoken);

        const data = {
          accesstoken: tokens.accesstoken,
          refreshExp: tokens.refreshExp
        };

        return msg.show200(req, res, data, "Auth Successful");
      } else {
        return msg.show401(req, res, next);
      }
    });
  });
};
