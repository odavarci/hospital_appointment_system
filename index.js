const express = require("express");
const path = require("path");
const app = express();
 
console.log(path.join(__dirname,));


const staticPath = path.join(__dirname);
app.use(express.static(staticPath));

app.get('/', function(req,res){
    res.send("/index.html");
});
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "\\assets\\css" + "/style.css");
  });
app.get('/about', function(res,req){
    console.log("port 3000");
});
app.get('/', function(res,req){
    console.log("port 3000");
});
app.listen(3000,function(){
    console.log("port 3000");
});

//DATABASE CONNECTION
const { Client } = require('pg');
require('dotenv').config();

module.exports.getClient = async () => {
    const client = new Client({
        host: "localhost",
        port: "5432",
        user: "postgres",
        password: "mklp%123",
        database: "372",
        ssl: false,
    });
    await client.connect();
    return client;
};