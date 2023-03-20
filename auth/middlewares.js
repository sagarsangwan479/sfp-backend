module.exports = {
    Authenticate:async (req,res,next) => {
        var Auth = require("../auth/authModel")
        if(req.headers.authorization != undefined){
            let token = req.headers.authorization.replace("Bearer ","");
            let verifyToken = await Auth.verifySessionToken(token);
            if(verifyToken.length){
               next()
            } else {
               return res.json({
                   message:'session expired'
               })
            }
        } else {
            return res.json({
                message:'error'
            })
        }
    },

    userAuth:async (req,res,next) => {
        var Auth = require("../auth/authModel")
        if(req.headers.authorization != undefined){
            let token = req.headers.authorization.replace("Bearer ","");
            let verifyToken = await Auth.verifyUserSessionToken(token);
            if(verifyToken.length){
                req.body.userId = verifyToken[0].id;
                req.body.userSessionToken = verifyToken[0].token;
                req.body.userName = verifyToken[0].name;
                req.body.userPhone = verifyToken[0].phone;
                req.body.userEmail = verifyToken[0].email;
                next()
            } else {
                return res.json({
                    message:'session expired'
                })
            }
        } else {
            return res.json({
                message:'error'
            })
        }
    }
}