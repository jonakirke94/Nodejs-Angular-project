

//success
exports.show200 = function(req, res, data, msg) { 
    res.status(200).json({
        msg:  msg,
        data: data
    });
}

//success returning a ressource
exports.show201 = function(req, res, data) { 
  res.status(201).json({
    msg: "Success!",
    data: data,
  });
}

//bad client request
exports.show400 = function(req, res, errors) {
  res.status(400).json({
    error: errors
  });
};

//unauthorized
exports.show401 = function(req, res, next) {
  res.status(401).json({});
};

//not found
exports.show404 = function(req, res, next) {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};

//conflict
exports.show409 = function(req, res, msg) {
  res.status(409).json({
    msg: msg
  });
};

//token refresh
exports.show419 = function(req, res) { 
  res.status(419);
  res.statusMessage = "Refreshing token";
  res.end();
}

//server error
exports.show500 = function(req, res, err) {
  console.log(err);

  res.status(500);
  res.json({
    error: {
      message: err.message
    }
  });
}
