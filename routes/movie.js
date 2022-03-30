const express = require('express');
const { celebrate } = require('celebrate');
const movieRouter = require('express').Router();
const { joiMovieIdScheme, joiMovieScheme } = require('../utils/validator');
const { getMovies, deleteMovie, addMovie } = require('../controllers/movie');

movieRouter.get('/', getMovies);
movieRouter.delete('/:movieId', celebrate(joiMovieIdScheme), deleteMovie);
movieRouter.post('/', express.json(), celebrate(joiMovieScheme), addMovie);

module.exports = { movieRouter };
