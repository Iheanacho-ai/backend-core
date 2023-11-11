const express = require('express');
const router = express.Router();
const {registerUser } = require('../controllers/register')


//register a user
router.post("/register", registerUser)

module.exports = router;