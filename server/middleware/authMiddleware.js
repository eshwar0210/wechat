const jwt = require('jsonwebtoken');
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1].slice(1, -1);
  // console.log(token);
  // console.log(process.env.JWT_SECRET);
  if (!token) {
    return res.status(403).send({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token invalid ")
      return res.status(401).send({ message: 'Invalid token' });
    }
    // console.log(req.user);
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
