const express = require("express");
const router = express.Router();
const db = require(".././../db/db");
const msg = require(".././../db/httpMsgs");

const userController = require('.././../controllers/user');

router.post("/signup", userController.user_signup);
router.post("/login", userController.user_login);
router.post("/verify", userController.verify_email);

module.exports = router;
