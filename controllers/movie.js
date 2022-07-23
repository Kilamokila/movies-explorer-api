const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

exports.addMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then(res.status(201))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getMovies = async (req, res, next) => {
  try {
    const savedMovies = await Movie.find({ owner: req.user._id }).populate(['owner']);
    if (!savedMovies) {
      throw new NotFoundError('Фильмов не нашлось :(');
    }
    res.send(savedMovies);
  } catch (error) {
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new NotFoundError(`Фильм с id: ${movieId} не обнаружена на сервере`));
    }
    if (!movie.owner.equals(req.user._id)) {
      return next(new ForbiddenError('Ошибка доступа.'));
    }
    const removedMovie = await Movie.remove(movie);
    if (!removedMovie) {
      return next(new NotFoundError('Передан неверный айди фильма, поэтому не получилось удалить.'));
    }
    res.send(removedMovie);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(err);
    }
  }
  return res.status;
};

module.exports = { getMovies };
