const express = require('express');
const { celebrate } = require('celebrate');
const { joiUserInfoScheme } = require('../utils/validator');
const { getUserInfo, updateUserInfo } = require('../controllers/user');

const userRouter = express.Router();

userRouter.get('/me', getUserInfo);
userRouter.patch('/me', express.json(), celebrate(joiUserInfoScheme), updateUserInfo);

module.exports = { userRouter };
