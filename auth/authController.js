const { validationResult } = require('express-validator')
const db = require('../db')
const Auth = require('./authModel')


exports.backendUserLogin = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.send({
            message:'invalid values',
            status:'invalid',
            err:errors.mapped()
        })
    }
        var loginData = await Auth.backendUserLogin(req.body);
        
        if(loginData.length){
            res.status(200).json({
                message:'Login Successfully',
                status:'success',
                userData:loginData[0]
            })
        } else {
            res.status(200).json({
                message:'Login Failed',
                status:'failed'
            })
        }
    }

exports.backendUserLogout = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.send({
            message:'invalid values',
            status:'invalid',
            err:errors.mapped()
        })
    }
        
        let logout = await Auth.backendUserLogout(req.body);

        if(logout.affectedRows > 0){
            res.json({
                message:'Logout Successfully',
                status:'success'
            })
        } else {
            res.json({
                message:'Logout Failed',
                status:'failed'
            })
        }
}

// user auth

exports.getSignupOtp = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();

        let checkMobileNo = await Auth.checkMobileNo(req.body);

        if(checkMobileNo){
            await db.commit();
            return res.json({
                message:'Mobile number already exists',
                status:'exist'
            }) 
        }
   
        let getSignupOtp = await Auth.getSignupOtp(req.body);

        // let sendOtpToEmail = await Auth.sendOtpToEmail(req.body);

        await db.commit();

        return res.json({
            message:'Otp Sent',
            status:'success'
        })
    } catch(error){
        await db.rollback();

        let errorData = {
            errCode:error.code,
            errNo:error.errno,
            message:error.sqlMessage
        }

        return res.json({
            message:'Otp not sent',
            status:'error',
            error: errorData
        })
    }
}

exports.signupWithOtp = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();
        
        let signupWithOtp = await Auth.signupWithOtp(req.body);
        
        if(signupWithOtp == 'success'){
            await Auth.setOtpEntered(req.body);
            await db.commit();
            res.json({
                message:'Otp entered successfully',
                status:'success',
            })
        } else if(signupWithOtp == 'invalid') {
            await db.commit();
            res.json({
                message:'Invalid OTP',
                status:'invalid'
            })
        } else if(signupWithOtp == 'expired'){
            await db.commit();
            res.json({
                message:'OTP expired, click on resend',
                status:'expired'
            })
        }
    } catch(err){
        await db.rollback();

        var errorData = {
            code:err.code,
            errno:err.errno,
            sqlMessage:err.sqlMessage
        }

        res.json({
            message:'Error',
            status:'error',
            error:errorData
        })
    }
}

exports.signup = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();

        let checkTempUser = await Auth.checkTempUser(req.body);

        if(!checkTempUser){
            await db.commit();
            return res.json({
                message:'Suspicious entry',
                status:'error'
            })
        } else {
            req.body.tempId = checkTempUser.id;
        }
       
        let signup = await Auth.signup(req.body);
        await Auth.setUserRegistered(req.body);

        await db.commit();

        res.json({
            message:'Signed Up',
            status:'success'
        })

    } catch(err){
        await db.rollback();

        var errorData = {
            code:err.code,
            errno:err.errno,
            sqlMessage:err.sqlMessage
        }

        res.json({
            message:err.errno == 1062 ? 'Already exist' : 'Signup failed, try again after sometime',
            status:'error',
            error:errorData
        })
    }
}

exports.userLogin = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();

        let userLogin = await Auth.userLogin(req.body);

        await db.commit()
        if(userLogin.logged_in == 1){
            return res.json({
                message:'Logged In Successfully',
                status:'success',
                userData:userLogin
            })
        } else {
            return res.json({
                message:'Invalid Credentialas',
                status:'failed'
            })
        }
    } catch(err){
        await db.rollback();

        var errorData = {
            code:err.code,
            errno:err.errno,
            sqlMessage:err.sqlMessage
        }

        res.json({
            message:'Error',
            status:'error',
            error:errorData
        })
    }



}

exports.getLoginOtp = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();

        let checkMobileNo = await Auth.checkMobileNo(req.body);

        if(!checkMobileNo){
            await db.commit();
            return res.json({
                message:'Mobile number not exists',
                status:'exist'
            }) 
        }
   
        let getLoginOtp = await Auth.getLoginOtp(req.body);

        // let sendOtpToEmail = await Auth.sendOtpToEmail(req.body);

        await db.commit();

        return res.json({
            message:'Otp Sent',
            status:'success'
        })
    } catch(error){
        await db.rollback();

        let errorData = {
            errCode:error.code,
            errNo:error.errno,
            message:error.sqlMessage
        }

        return res.json({
            message:'Otp not sent',
            status:'error',
            error: errorData
        })
    }
}

exports.loginWithOtp = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();
        
        let loginWithOtp = await Auth.loginWithOtp(req.body);
        
        if(loginWithOtp.logged_in == 1){
            await db.commit();
            res.json({
                message:'Logged In Successfully',
                status:'success',
            })
        } else if(loginWithOtp == 'invalid') {
            await db.commit();
            res.json({
                message:'Invalid OTP',
                status:'invalid'
            })
        } else if(loginWithOtp == 'expired'){
            await db.commit();
            res.json({
                message:'OTP expired, click on resend',
                status:'expired'
            })
        }
    } catch(err){
        await db.rollback();

        var errorData = {
            code:err.code,
            errno:err.errno,
            sqlMessage:err.sqlMessage
        }

        res.json({
            message:'Error',
            status:'error',
            error:errorData
        })
    }
}

exports.forgotPasswordGetOtp = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();

        let checkMobileNo = await Auth.checkMobileNo(req.body);

        if(!checkMobileNo){
            await db.commit();
            return res.json({
                message:'Mobile number not exists',
                status:'exist'
            }) 
        }
   
        let getLoginOtp = await Auth.getPasswordOtp(req.body);

        // let sendOtpToEmail = await Auth.sendOtpToEmail(req.body);

        await db.commit();

        return res.json({
            message:'Otp Sent',
            status:'success'
        })
    } catch(error){
        await db.rollback();

        let errorData = {
            errCode:error.code,
            errNo:error.errno,
            message:error.sqlMessage
        }

        return res.json({
            message:'Otp not sent',
            status:'error',
            error: errorData
        })
    }
}

exports.enterPasswordOtp = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();
        
        let loginWithOtp = await Auth.enterPasswordOtp(req.body);
        
        if(loginWithOtp == 'success'){
            await db.commit();
            res.json({
                message:'Otp Entered Successfully',
                status:'success',
            })
        } else if(loginWithOtp == 'invalid') {
            await db.commit();
            res.json({
                message:'Invalid OTP',
                status:'invalid'
            })
        } else if(loginWithOtp == 'expired'){
            await db.commit();
            res.json({
                message:'OTP expired, click on resend',
                status:'expired'
            })
        }
    } catch(err){
        await db.rollback();

        var errorData = {
            code:err.code,
            errno:err.errno,
            sqlMessage:err.sqlMessage
        }

        res.json({
            message:'Error',
            status:'error',
            error:errorData
        })
    }
}

exports.createNewPassword = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    try {
        await db.beginTransaction();

        let createNewPassword = await Auth.createNewPassword(req.body);

        res.json({
            message:'Password Changed Successfully',
            status:'success'
        })
    } catch(err){
        await db.rollback();

        var errorData = {
            code:err.code,
            errno:err.errno,
            sqlMessage:err.sqlMessage
        }

        res.json({
            message:'Error',
            status:'error',
            error:errorData
        })
    }
}

exports.userLogout = async (req,res) => {
    try {
        await db.beginTransaction();

        await Auth.userLogout(req.body);

        await db.commit();
        res.json({
            message:'Logged Out',
            status:'success'
        })
    } catch(err){
        await db.rollback();

        var errorData = {
            code:err.code,
            errno:err.errno,
            sqlMessage:err.sqlMessage
        }

        res.json({
            message:'Error',
            status:'error',
            error:errorData
        })
    }
}
