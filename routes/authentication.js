const express = require('express');
const { celebrate } = require('celebrate');
const authenticationRouter = require('express').Router();
const { login } = require('../controllers/login');
const { createUser } = require('../controllers/createUser');
const { joiSignInScheme, joiSignUpScheme } = require('../utils/validator');

authenticationRouter.post('/signin', express.json(), celebrate(joiSignInScheme), login);
authenticationRouter.post('/signup', express.json(), celebrate(joiSignUpScheme), createUser);

module.exports = { authenticationRouter };
