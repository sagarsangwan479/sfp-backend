const express = require('express');
const router = express.Router();
const { oneOf, check, body } = require('express-validator');

const auth = require('../auth/authController');
const { userAuth } = require('../auth/middlewares');

router.post('/get_signup_otp',oneOf([
    [
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number')
    ]
]),auth.getSignupOtp);

router.post('/signup_with_otp',oneOf([
    [
        body('otp').notEmpty().withMessage('Otp is required'),
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number')
    ]
]),auth.signupWithOtp)

router.post('/signup',oneOf([
    [
        body('name').notEmpty().withMessage('name is required'),
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number'),
        body('password').isLength({min:8}).withMessage('password must be atleast 8 characters long').isAlphanumeric().withMessage('password must contain both alphabet and numbers')
    ]
]),auth.signup);

router.post('/login',oneOf([
    [
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number'),
        body('password').notEmpty().withMessage('password is required')
    ]
]),auth.userLogin);

router.post('/get_login_otp',oneOf([
    [
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number')
    ]
]),auth.getLoginOtp);

router.post('/login_with_otp',oneOf([
    [
        body('otp').notEmpty().withMessage('Otp is required'),
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number')
    ]
]),auth.loginWithOtp);

router.post('/forgot_password_otp',oneOf([
    [
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number')
    ]
]),auth.forgotPasswordGetOtp);

router.post('/enter_password_otp',oneOf([
    [
        body('otp').notEmpty().withMessage('Otp is required'),
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number')
    ]
]),auth.enterPasswordOtp);

router.post('/create_new_password',oneOf([
    [
        body('phone').isLength({min:10,max:10}).withMessage('invalid phone number').isNumeric().withMessage('invalid phone number'),
        body('password').isLength({min:8}).withMessage('password must be atleast 8 characters long').isAlphanumeric().withMessage('password must contain both alphabet and numbers')
    ]
]),auth.createNewPassword);

router.post('/logout',userAuth,auth.userLogout);

// profile 

// address

// change password

// update profile pic

// product categories list

// product list

// cart

// orders

// payment 

// // middlewares

// // encrypted password

module.exports = router;