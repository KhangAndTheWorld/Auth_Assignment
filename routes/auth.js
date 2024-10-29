const express = require('express');
const authController = require('../controllers/Auth-Controller');
const verifySignUp = require('../middlewares/Verify-SignUp');

const router = express.Router();

router.post("/signup", [verifySignUp.checkDuplicateEmail, verifySignup.checkRoleExist], authController.signUp);

router.post("/signin", authController.signIn)


module.exports = router;
