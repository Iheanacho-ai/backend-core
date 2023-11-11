const express = require('express');
const router = express.Router();
const user = require('./user')

//Home page route
router.get("/", function(req, res){
    res.send("Hey there!")
})

//User routes
router.use('/user', user)

module.exports = router;