const db = require('./../../db');
const moment = require('moment');

var Common = () => {}

Common.getUserSettingByType = (postData) => {
    return new Promise((resolve,reject) => {

        let queryString = 'SELECT * FROM user_settings WHERE type = ? AND status = ?';
        let filter = [postData.type,1];

        db.query(queryString,filter,(err,res) => {
            if(err){
                return reject(err);
            } else {
                let data = {};
                if(res.length){
                    data = res[0];
                }
                resolve(data);
            }
        })
    })
}

module.exports = Common;