const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const AuthError = require('../errors/AuthError');
const DuplicateKeyError = require('../errors/DuplicateKeyError');

exports.updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  return User.findByIdAndUpdate(userId, { name, email }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then(res.status(200))
    .then((newUserInfo) => res.send(newUserInfo))
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

exports.getUserInfo = (req, res, next) => {
  const currentUserId = req.user._id;
  if (!currentUserId) {
    next(new AuthError('Ошибка авторизации'));
  }
  return User.findById(currentUserId)
    .then((user) => res.status(200).send({ email: user.email, name: user.name }))
    .catch(next);
};
