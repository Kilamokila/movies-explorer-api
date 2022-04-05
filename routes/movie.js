const express = require('express');
const { celebrate } = require('celebrate');
const movieRouter = require('express').Router();
const { joiMovieIdScheme, joiMovieScheme } = require('../utils/validator');
const { getMovies, deleteMovie, addMovie } = require('../controllers/movie');

movieRouter.get('/movies', getMovies);
movieRouter.delete('/movies/:movieId', celebrate(joiMovieIdScheme), deleteMovie);
movieRouter.post('/movies', express.json(), celebrate(joiMovieScheme), addMovie);

module.exports = { movieRouter };
