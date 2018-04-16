const express = require('express');
const app = express();
const morgan = require('morgan'); //npm package for logging - npm install --save morgan
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const httpMsg = require('./db/httpMsgs');

const productRoutes = require('./api/routes/products')
const userRoutes = require('./api/routes/user');
const tokenRoutes = require('./api/routes/token');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());

//set up CORS to pass correct headers
// https://www.youtube.com/watch?v=zoSJ3bNGPp0
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//app.use sets up a middleware where incoming requests have to go through use
app.use('/products', productRoutes);
app.use('/user', userRoutes);
app.use('/token', tokenRoutes);

//error handling if no routing was hit
app.use((req, res, next) => {
    httpMsg.show404(req,res,next);
});

app.use((error, req, res, next) => {
    httpMsg.show500(req,res,error);
});





//if you don't want the server to restart every time you make a change install nodemon
//npm install --save-dev nodemon
//https://www.youtube.com/watch?v=UVAMha41dwo



module.exports = app;