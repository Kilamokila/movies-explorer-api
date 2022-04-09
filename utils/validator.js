const { Joi } = require('celebrate');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;
const BadRequestError = require('../errors/BadRequestError');

exports.joiMovieScheme = {
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      throw new BadRequestError('Формат ссылки некорректен');
    }),
    trailerLink: Joi.string().required().custom((value) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      throw new BadRequestError('Формат ссылки некорректен');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      throw new BadRequestError('Формат ссылки некорректен');
    }),
    movieId: Joi.number().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
};

exports.joiMovieIdScheme = {
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
};

exports.joiUserInfoScheme = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
};

exports.joiSignUpScheme = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};

exports.joiSignInScheme = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};
