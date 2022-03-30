const express = require('express');
const { celebrate, errors } = require('celebrate');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const { userRouter } = require('./routes/user');
const { movieRouter } = require('./routes/movie');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/createUser');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { joiSignUpScheme, joiSignInScheme } = require('./utils/validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', express.json(), celebrate(joiSignInScheme), login);
app.post('/signup', express.json(), celebrate(joiSignUpScheme), createUser);
app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.use(errorLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
