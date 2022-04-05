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

exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then(res.status(200))
    .then((cards) => res.send(cards))
    .catch(next);
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
