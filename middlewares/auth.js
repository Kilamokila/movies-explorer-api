const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  try {
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
