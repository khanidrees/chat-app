const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports.isAuthorized = (req, res, next) => {
  console.log(req.headers);
  try {
    const { authorization } = req.headers;
    console.log(authorization);
    const decoded = jwt.verify(authorization, process.env.JWT_PRIVATE_KEY);
    if (decoded) next();
  } catch (error) {
    next(createError(401, 'Unauthorized Request'));
  }
};
