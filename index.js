const express = require('express');
const router = express.Router();
const { oneOf, check, body } = require('express-validator');


const auth = require('./auth/auth');


router.get('/get_login_otp',oneOf([
    [
        body('email').notEmpty().withMessage('email is required'),
        body('email').isEmail().withMessage('enter correct email'),
        body('password').isLength({min:8}).withMessage('password must be atleast 8 characters long'),
        body('password').isAlphanumeric().withMessage('password must contain both alphabet and numbers')
    ]
]),auth.getLoginOtp);

// router.post('/signup',)

// router.post('/logout')

module.exports = router;