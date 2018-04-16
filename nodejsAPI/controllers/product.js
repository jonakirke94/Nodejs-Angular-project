const express = require("express");
const router = express.Router();
const db = require("../db/db");
const msg = require("../db/httpMsgs");
const Parameter = require('../helpers/parameter');

exports.products_get_all = (req, res, next) => {
    db.executeSql("SELECT * FROM Products", function(data, err) {
        if (err) {
          msg.show500(req, res, err);
        } else {
          msg.show200(req, res, data.recordset);
        }
    });
}

exports.products_get = (req, res, next) => {
    let params = [];
    params.push(new Parameter('id', 'Int' , req.params.productId));

    db.executeSql(`SELECT * FROM Products WHERE ProductId = (@id)`, function(
      data,
      err
    ) {
      if (err) {
        msg.show500(req, res, err);
      } else {
        msg.show200(req, res, data.recordset, "Success!");
      }
    }, params);
}

exports.products_create = (req, res, next) => { 
//list of built in validators in express: https://github.com/chriso/validator.js#validators
req.check("name", "Name cannot be empty").isLength({ min: 3 });
req.check("description", "Description cannot be empty").isLength({ min: 10 });
const errors = req.validationErrors();

if (errors) {
  console.log("error");
  msg.show400(req, res, errors);
}

let params = [];
params.push(new Parameter('name', 'NVarChar' , req.body.name));
params.push(new Parameter('description', 'NVarChar' , req.body.description));

db.executeSql(
  `INSERT INTO Products VALUES((@name), (@description))`,
  function(data, err) {
    if (err) {
      msg.show500(req, res, err);
    } else {
      msg.show201(req, res, data);
    }
  }, params);
}

exports.products_delete = (req, res, next) => {
    req.check('productId', 'Id must be a numeric').isNumeric();
    const errors = req.validationErrors();
  
    if (errors) {
      msg.show400(req, res, errors);
    }

    let params = [];
    params.push(new Parameter('id', 'Int' , req.params.productId));
    
    db.executeSql(`DELETE FROM Products WHERE ProductId = (@id)`, function(
      data,
      err
    ) {
      if (err) {
        msg.show500(req, res, err);
      } else {
        msg.show200(req, res, data);
      }
    }, params);
}

exports.products_update = (req, res, next) => {
      //validate input
  req.check("name", "Name cannot be empty").isLength({ min: 1 });
  req.check("description", "Description cannot be empty").isLength({ min: 1 });
  const errors = req.validationErrors();
 
  if (errors) {
    msg.show400(req, res, errors);
  }

  let findParams = [];
  const idParam = new Parameter('id', 'Int' , req.params.productId);
  findParams.push(idParam);

  db.executeSql(`SELECT * FROM [dbo].[Products] WHERE ProductId = (@id)`, function(data, err) {
    if (err) {
      msg.show500(req, res, err);
    }

    if(Object.keys(data.recordset).length === 0) {
      msg.show404(req, res, next);
    }

    let updateParams = [];
    updateParams.push(idParam);

    //Build sql command
    let sql = ("UPDATE [dbo].[Products] SET");
    
    if(req.body.name) {
      updateParams.push(new Parameter('name', 'NVarChar' , req.body.name));
      sql += ` Name=(@name),`;
      
    }

    if(req.body.description) {
      updateParams.push(new Parameter('desc', 'NVarChar' , req.body.description));

      sql += ` Description=(@desc),`;
    }

    //remove trailing comma
    sql = sql.slice(0, -1);
    sql += ` WHERE ProductId = (@id)`;

    db.executeSql(sql, function(data, err) { 
      if (err) {
        msg.show500(req, res, err);
      } else {
        msg.show200(req, res, data, "Success!");
      }
    }, updateParams);
  }, findParams);
}