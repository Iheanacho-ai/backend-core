const express = require('express');
const router = express.Router();
const {registerUser, loginUser } = require('../controllers/register')


//register a user
router.post("/register", registerUser)
router.post("/signin", loginUser)

module.exports = router;