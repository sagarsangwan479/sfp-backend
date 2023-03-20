const express = require("express");
const app = express();
const userRouter = require('./user/index');
const adminRouter = require('./admin/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql2');


// var db = mysql.createConnection({
//     host: "localhost",
//     user:'root',
//     password:'123456',
//     database: "sangwan fashion point",
//     port:3306
// }); 

const port = 8000;


app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/app',userRouter);
app.use('/admin',adminRouter);

app.listen(port, () => {
    console.log("app is running");
});

