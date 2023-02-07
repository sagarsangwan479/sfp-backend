const mysql =  require('mysql2');

var db = mysql.createConnection({
    host: "localhost",
    user:'root',
    password:'123456',
    database: "sangwan fashion point",
    port:3306
});

db.connect((err)=>{
    if(err) throw err;
})

module.exports = db;