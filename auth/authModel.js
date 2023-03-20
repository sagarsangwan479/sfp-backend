const Common = require('./../common/models/commonModel')
const db = require("../db");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config();


var Auth = () => {};

const generateOtp = () => {
  let randomNumber = Math.random();
  randomNumber = parseInt(randomNumber * 10000);

  let len = randomNumber.toString().length;
  
  if(len != 4){
    randomNumber = generateOtp();
  }

  return randomNumber;
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

Auth.checkMobileNo = (postData) => {
  return new Promise((resolve,reject) => {
    let queryString = 'SELECT phone FROM users WHERE phone = ?';
    let filter = [postData.phone];

    db.query(queryString,filter,(err,res) => {
      if(err){
        return reject(err);
      } else {
        if(res.length){
          resolve(true);
        } else {
          resolve(false);
        }
      }
    })
  })
}
Auth.getSignupOtp = (postData) => {
  return new Promise((resolve,reject) => {

    let otp = generateOtp();

    let insertData = {
      phone:postData.phone,
      otp:otp,
      user_registered:0,
      added_on:new Date(),
      updated_on:new Date()
    }

    let queryString = 'INSERT INTO temp_register SET ? ON DUPLICATE KEY UPDATE otp = ?, updated_on = ?';
    let filter = [insertData,otp,new Date()];
    
    db.query(queryString,filter,(err,res)=>{
      if(err){
        return reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

Auth.sendOtpToPhone = (postData) => {
  return new Promise((resolve,reject) => {


  })
}

Auth.signupWithOtp = (postData) => {
  return new Promise((resolve,reject) => {
    let queryString = 'SELECT * FROM temp_register WHERE phone = ? AND user_registered = ? AND otp = ?';
    let filter = [postData.phone,0,postData.otp];

    db.query(queryString,filter,(err,res)=>{
      if(err){
        return reject(err);
      } else {
        if(res.length){

          let currentDate = new Date();
          let tempEntryDate = new Date(res[0].updated_on);
          let diff = (currentDate - tempEntryDate)/1000;

          if(res[0].otp_valid_upto >= diff){
            resolve('success');
          } else {
            resolve('expired');
          }
        } else {
          resolve('invalid');
        }
      }
    })
  })
}

Auth.setOtpEntered = (postData) => {
  return new Promise((resolve,reject) => {
    let queryString = 'UPDATE temp_register SET otp_entered = ?, updated_on = ? WHERE phone = ?';
    let filter = [1,new Date(),postData.phone];

    db.query(queryString,filter,(err,res) => {
      if(err){
        return reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

Auth.checkTempUser = (postData) => {
  return new Promise((resolve,reject) => {
    let queryString = 'SELECT id FROM temp_register WHERE phone = ? AND otp_entered = ?';
    let filter = [postData.phone,1];

    db.query(queryString,filter,(err,res) => {
      if(err){
        return reject(err);
      } else {
        if(res.length){
          resolve(res[0]);
        } else {
          resolve(false);
        }
      }
    })
  })
}

Auth.signup = (postData) => {
  return new Promise((resolve,reject) => {

    let tokenData = {
      name: postData.name,
      phone: postData.phone,
      tempId:postData.tempId
    };
    
    let token = jwt.sign({tokenData},process.env.SECRET_KEY,{algorithm:process.env.ALGORITHM});
    
    let insertData = {
      name:postData.name,
      password:postData.password,
      phone:postData.phone,
      email:'',
      token:token,
      created_on:new Date(),
      updated_on:new Date()
    }

    let queryString = 'INSERT INTO users SET ?';

    db.query(queryString,insertData,(err,res) => {
      if(err){
        return reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

Auth.setUserRegistered = (postData) => {
  return new Promise((resolve,reject) => {

    let queryString = 'UPDATE temp_register SET user_registered = ? WHERE phone = ?';
    let filter = [1,postData.phone];

    db.query(queryString,filter,(err,res) => {
      if(err){
        return reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

Auth.userLogin = (postData) => {
  return new Promise((resolve,reject) => {

    let queryString = 'SELECT id,name,phone FROM users WHERE phone = ? AND password = ?';
    let filter = [postData.phone,postData.password];

    db.query(queryString,filter, async (err,res) => {
      if(err){
        return reject(err);
      } else {
        if(res.length){

          let tokenData = {
            name: res[0].name,
            phone: res[0].phone,
            id: res[0].id
          };
          
          let updateSessionToken = await Auth.updateUserSessionToken(tokenData);
          updateSessionToken.name = res[0].name;
          updateSessionToken.phone = res[0].phone;

          resolve(updateSessionToken);

        } else {
          resolve({logged_in:0});
        }
      }
    })

    
  })
}

Auth.verifyUserSessionToken = (postData) => {
  return new Promise((resolve,reject)=>{
    var queryString = "SELECT * FROM users WHERE token = ?";
    db.query(queryString,postData,(err,res)=>{
      if(err){
        return reject(err);
      } else {
        resolve(res)
      }
    })
  })
}

Auth.updateUserSessionToken = (postData) => {
  return new Promise((resolve, reject) => {

    let tokenData = {
      name: postData.name,
      phone: postData.phone,
      id: postData.id,
    };

    let token = jwt.sign({tokenData},process.env.SECRET_KEY,{algorithm:process.env.ALGORITHM});

    let updateData = {
        token:token,
        last_login_on:new Date(),
        logged_in:1
    }

    let queryString = "UPDATE users SET ? WHERE id = ?";
    let filter = [updateData,postData.id];

    db.query(queryString,filter,async (err,res)=>{
        if(err){
            return reject(err);
        } else {
            let data = {};
            data.session_token = token;
            data.login_on = updateData.last_login_on;
            data.logged_in = updateData.logged_in;
            resolve(data);
        }
    })
  });
};

Auth.getLoginOtp = (postData) => {
  return new Promise((resolve,reject) => {

    let otp = generateOtp();

    let updateData = {
      otp_code:otp,
      otp_updated_on:new Date()
    }

    let queryString = 'UPDATE users SET ? WHERE phone = ?';
    let filter = [updateData,postData.phone];
    
    db.query(queryString,filter,(err,res)=>{
      if(err){
        return reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

Auth.loginWithOtp = (postData) => {
  return new Promise((resolve,reject) => {
    let queryString = 'SELECT * FROM users WHERE phone = ? otp_code = ?';
    let filter = [postData.phone,postData.otp];

    db.query(queryString,filter, async (err,res)=>{
      if(err){
        return reject(err);
      } else {
        if(res.length){

          let userSettingData = await Common.getUserSettingByType({type:'loginOtpTimeLimit'});
          let otpValidUpto = userSettingData.value;

          let currentDate = new Date();
          let otpUpdatedDate = new Date(res[0].otp_updated_on);
          let diff = (currentDate - otpUpdatedDate)/1000;

          if(otpValidUpto >= diff){

            let tokenData = {
              name: res[0].name,
              phone: res[0].phone,
              id: res[0].id
            };
            
            let updateSessionToken = await Auth.updateUserSessionToken(tokenData);
            updateSessionToken.name = res[0].name;
            updateSessionToken.phone = res[0].phone;
  
            resolve(updateSessionToken);
          } else {
            resolve('expired');
          }
        } else {
          resolve('invalid');
        }
      }
    })
  })
}

Auth.getPasswordOtp = (postData) => {
  return new Promise((resolve,reject) => {

    let otp = generateOtp();

    let updateData = {
      password_otp_code:otp,
      password_otp_updated_on:new Date()
    }

    let queryString = 'UPDATE users SET ? WHERE phone = ?';
    let filter = [updateData,postData.phone];
    
    db.query(queryString,filter,(err,res)=>{
      if(err){
        return reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

Auth.enterPasswordOtp = (postData) => {
  return new Promise((resolve,reject) => {

    let queryString = 'SELECT * FROM users WHERE phone = ? password_otp_code = ?';
    let filter = [postData.phone,postData.otp];

    db.query(queryString,filter, async (err,res)=>{
      if(err){
        return reject(err);
      } else {
        if(res.length){

          let userSettingData = await Common.getUserSettingByType({type:'forgotPasswordOtpTimeLimit'});
          let otpValidUpto = userSettingData.value;

          let currentDate = new Date();
          let otpUpdatedDate = new Date(res[0].password_otp_updated_on);
          let diff = (currentDate - otpUpdatedDate)/1000;

          if(otpValidUpto >= diff){
            resolve('success');
          } else {
            resolve('expired');
          }
        } else {
          resolve('invalid');
        }
      }
    })
  })
}

Auth.changePassword = (postData) => {
  return new Promise((resolve,reject) => {

    let queryString = 'UPDATE users SET password = ? WHERE id = ?';
    let filter = [];
  })
}

Auth.createNewPassword = (postData) => {
  return new Promise((resolve,reject) => {

    let queryString = 'UPDATE users SET password = ? WHERE phone = ?';
    let filter = [postData.password,postData.phone];

    db.query(queryString,filter,(err,res) => {
      if(err){
        return reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

Auth.userLogout = (postData) => {
  return new Promise((resolve,reject) => {

    let updateData = {
      token:'',
      logged_in:0
    }

    let queryString = 'UPDATE users SET ? WHERE id = ?';
    let filter = [updateData,postData.userId];

    db.query(queryString,filter,(err,res) => {
      if(err){
        return reject(err);
      } else {
        resolve(res);
      }
    })
  })
}


module.exports = Auth;
