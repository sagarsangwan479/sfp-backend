const express = require('express');
const router = express.Router();
const db = require('../db');
const authController = require('../auth/authController');
const backendUserController = require('./controllers/backendUserController')
const Middleware = require('../auth/middlewares')
const { oneOf, check } = require('express-validator');
const { Authenticate } = require('../auth/middlewares');

router.post('/login',oneOf([
    [
        check('username',"Username is required").notEmpty(),
        check('password',"Password is required").notEmpty()
    ]
]),authController.backendUserLogin)

router.post('/logout',oneOf([
    [
        check('userId',"User Id is required").notEmpty()
    ]
]),authController.backendUserLogout)

router.post('/menu/list',Authenticate,backendUserController.getMenuList)

module.exports = router;