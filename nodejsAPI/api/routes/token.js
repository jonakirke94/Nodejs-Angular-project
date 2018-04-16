const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/httpMsgs");


const tokenController = require('.././../controllers/token');

router.post("/", tokenController.refreshToken);

module.exports = router;
