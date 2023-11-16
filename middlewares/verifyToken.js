const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split("")[1];
  if(token == null){ 
    return res.status(403).send({
      message: "User token is missing"
    })
  }
  jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
    if(err) return res.sendStatus(403);
    req.user = user;
    next()
  })
}

module.exports = verifyToken

