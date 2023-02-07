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

exports.getLoginOtp = async (req,res) => {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            message:'Invalid values',
            status:'invalid',
            error:errors.mapped()
        })
    }

    let getLoginOtp = await Auth.getLoginOtp(req.body);

    
}
