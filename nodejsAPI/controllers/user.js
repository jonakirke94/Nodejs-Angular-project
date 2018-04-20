const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/httpMsgs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenController = require("./token");
const Parameter = require('../helpers/parameter');
const mailer = require('../services/mailer');
const tokens = require('../controllers/token');

const baseUrl = 'http://localhost:4200/';

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

          //generate secret token to verify email & expiration      
          const verificationToken = tokens.generateVerificationToken();

          let params = [];
          params.push(new Parameter('email', 'NVarChar' , email));
          params.push(new Parameter('hash', 'NVarChar' , hash));
          params.push(new Parameter('veriToken', 'NVarChar' , verificationToken));

          const SQL = `INSERT INTO Users VALUES(null, (@email), (@hash), null, 0, (@veriToken) ,0)`;
          db.executeSql(SQL, function(data, err) {
              if (err) {
                return msg.show500(req, res, err);
              } 
                //compose the verification email
                const url = baseUrl + `verify?verificationToken=${verificationToken}`
                const html = `Hi there, <br> Please verify your email by clicking this link
                <a href="${url}">Click here</a>`;

                //send the email
                mailer.sendEmail('webmaster@oddsman.dk', email, "Please verify your email", html);

                msg.show201(req, res, req.body);            
            }, params
          );
        }
      });
  })

  
};

exports.userById = (id, callback) => {

  let params = [];
  params.push(new Parameter('id', 'Int' , id));

  const SQL = `SELECT * FROM Users WHERE UserId = (@id))`
  db.executeSql(SQL, function(
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

  db.executeSql(`SELECT * FROM Users WHERE Email= (@email)`, function(
    data,
    err
  ) {
    if (err) {
      msg.show500(req, res, err);
    } else {
      callback(data);
    }
  }, params);
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
          refreshExp: tokens.refreshExp,
          isVerified: user.IsConfirmed
        };

        return msg.show200(req, res, data, "Auth Successful");
      } else {
        return msg.show401(req, res, next);
      }
    });
  });
};


exports.verify_email = (req, res, next) => {
  const veriToken = req.body.veriToken;

  //Find the user that matches the verificationtoken
  let params = [];
  params.push(new Parameter('veriToken', 'NVarChar' , veriToken));

  db.executeSql(`SELECT * FROM Users WHERE VerificationToken=(@veriToken)`, function(
    data,
    err
  ) {
      if (err) {
        return msg.show500(req, res, err);
      } 
      const user = data.recordset[0];

      //check if user was found
      if (typeof user == "undefined") {
        return msg.show401(req, res, next);
      }

      //check if the token has expired
      try {
        jwt.verify(veriToken,  process.env.JwtVerificationKey);
        VerifyEmail(user.UserId);
    
      } catch(error) {
        if(error["name"] == 'TokenExpiredError') {
          return msg.show410(req,res);

        }
    }
  }, params);


function VerifyEmail(id) {
  let updateParams = [];
      updateParams.push(new Parameter('confirmed', 'Bit' , 1));
      updateParams.push(new Parameter('veriToken', 'NVarChar' , ''));
      updateParams.push(new Parameter('id', 'Int' , id));

      const SQL = "UPDATE Users SET VerificationToken=(@veriToken), IsConfirmed=(@confirmed) WHERE UserId = (@id)"

      db.executeSql(SQL, function(data, err) { 
        if (err) {
          return msg.show500(req, res, err);
        } else {
          console.log('Confirmed')
          return msg.show200(req, res, data, "Verified email successfully!");
        }
      }, updateParams);
}


}