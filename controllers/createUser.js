const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const DuplicateKeyError = require('../errors/DuplicateKeyError');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(res.status(201))
    .then(() => res.send({
      data: {
        name, email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.code === 11000) {
        next(new DuplicateKeyError('Такой Email уже был использован при регистрации'));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser };
