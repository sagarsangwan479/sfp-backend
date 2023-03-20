var db = require("../../db");

var User = () => {}

User.getMenuList = (postData) => {
    return new Promise((resolve,reject)=>{
        db.query("SELECT * FROM menu WHERE status = '1'",(err,res)=>{
            if(err){
                return reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = User