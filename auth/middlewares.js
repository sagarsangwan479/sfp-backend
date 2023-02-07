module.exports = {
    Authenticate:async function(req,res,next){
        var Auth = require("../auth/authModel")
        if(req.headers.authorization != undefined){
            let token = req.headers.authorization.replace("Bearer ","");
            let verifyToken = await Auth.verifySessionToken(token);
            if(verifyToken.length){
               next()
            } else {
               res.json({
                   message:'session expired'
               })
            }
        }
    }
}