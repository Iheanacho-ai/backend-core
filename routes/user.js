const express = require('express');
const router = express.Router();
const registerUser = require('../controllers/user/register')
const loginUser = require('../controllers/user/login')
const forgotPassword = require('../controllers/user/forgotPassword')
const {getResetPassword, postResetPassword} = require('../controllers/user/resetPassword')


//register a user
router.post("/register", registerUser)
router.post("/signin", loginUser)
router.post("/forgot_password", forgotPassword)
router.get("/reset_password", getResetPassword)
router.post("/reset_password", postResetPassword)

module.exports = router;