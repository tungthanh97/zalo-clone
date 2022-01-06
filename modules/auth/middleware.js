const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //Get token from headers
  const token = req.header('Authorization').replace('Bearer ', '');
  //Check if not token
  if (!token) {
    next(new AuthenError('No token, authorization denied'));
  }
  //Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    next(new AuthenError('Invalid Token'));
  }
};
