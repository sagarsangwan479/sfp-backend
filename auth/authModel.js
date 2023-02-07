const db = require("../db");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();


var Auth = () => {};

const generateOtp = () => {
  let numb = Math.random();
}

Auth.backendUserLogin = (postData) => {
  return new Promise((resolve, reject) => {
    let queryString =
      "SELECT A.id,A.name,A.username,A.phone,A.email,B.role_name FROM backend_users A LEFT JOIN role B ON A.role = B.id WHERE username = ? AND password = ? AND A.status = ?";
    let filter = [postData.username, postData.password, 1];
    db.query(queryString, filter, async (err, res) => {
      if (err) {
        return reject(err);
      } else {
        if (res.length) {
          let updateSessionToken = await Auth.updateSessionToken(res[0]);
          res[0].session_token = updateSessionToken.session_token
            ? updateSessionToken.session_token
            : "";
            res[0].login_on = updateSessionToken.login_on;
            res[0].logged_in = updateSessionToken.logged_in;

          resolve(res);
        } else {
          resolve("");
        }
      }
    });
  });
};

Auth.backendUserLogout = (postData) => {
    return new Promise((resolve,reject)=>{
        let queryString = "UPDATE backend_users SET ? WHERE id = ?";
        let updateData = {
            session_token:'',
            logged_in:0,
            logout_on:new Date()
        }
        let filter = [updateData,postData.userId];
        db.query(queryString,filter,(err,res)=>{
            if(err){
                return reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

Auth.updateSessionToken = (postData) => {
  return new Promise((resolve, reject) => {
    let tokenData = {
      name: postData.name,
      phone: postData.phone,
      username: postData.username,
    };
    let token = jwt.sign({tokenData},process.env.SECRET_KEY,{algorithm:process.env.ALGORITHM});
    let queryString = "UPDATE backend_users SET ? WHERE id = ?"
    let updateData = {
        session_token:token,
        login_on:new Date(),
        logged_in:1
    }
    let filter = [updateData,postData.id];
    db.query(queryString,filter,async (err,res)=>{
        if(err){
            return reject(err);
        } else {
            res.session_token = token;
            res.login_on = updateData.login_on;
            res.logged_in = updateData.logged_in;
            resolve(res);
        }
    })
  });
};

Auth.verifySessionToken = (postData) => {
  return new Promise((resolve,reject)=>{
    var queryString = "SELECT * FROM backend_users WHERE session_token = ?";
    db.query(queryString,postData,(err,res)=>{
      if(err){
        return reject(err);
      } else {
        resolve(res)
      }
    })
  })
}

// user auth

Auth.getLoginOtp = (postData) => {
  return new Promise((resolve,reject) => {

    let insertData = {

    }
    let queryString = ''
  })
}



module.exports = Auth;
