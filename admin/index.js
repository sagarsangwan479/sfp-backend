const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../auth/auth');
const userController = require('../admin/controllers/userController')
const Middleware = require('../auth/middlewares')
const { oneOf, check } = require('express-validator');
const { Authenticate } = require('../auth/middlewares');

router.post('/login',oneOf([
    [
        check('username',"Username is required").notEmpty(),
        check('password',"Password is required").notEmpty()
    ]
]),auth.backendUserLogin)

router.post('/logout',oneOf([
    [
        check('userId',"User Id is required").notEmpty()
    ]
]),auth.backendUserLogout)

router.post('/menu/list',Authenticate,userController.getMenuList)

module.exports = router;