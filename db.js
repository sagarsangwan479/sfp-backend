const mysql =  require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database: process.env.DB_NAME,
    port:process.env.DB_PORT
});

db.connect((err)=>{
    if(err) throw err;
})

module.exports = db;