const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
console.log(path.join(__dirname,));

 
const staticPath = path.join(__dirname);
app.use(express.static(staticPath));

app.get('/', function(req,res){
    res.send("/index.html");
});
app.get('/deneme', async function(req,res){
   res.json(await getDoctorsByDepartment());
});
app.post('/tcno', (req, res) => {
    console.log(req.body);

    const {tcno} = req.body;
    console.log(tcno);
});

app.get('/123', async function (req, res) {
    let b;
    b = await getPatientsName();
    console.log(b);
    res.json(b);
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

async function getClient() {
    const client = new Client({
        host: "localhost",
        port: "5432",
        user: "postgres",
        password: "konya2001",
        database: "proje",
        ssl: false,
    });
    await client.connect();
    return client;
}

//DATABASE QUERIES
async function getPatientsName() {
    const client = await getClient();
    const entries = await client.query(`SELECT Ad, Soyad FROM HASTA;`);

    str = `${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`
    out = str.split("\n")
    for (let i = 0; i < out.length; i++) {
        out[i] = out[i].split("\t")
    }

    await client.end();
    return out;
}


async function getDepartmentName() {
    const client = await getClient();
    const entries = await client.query(`SELECT p_isim FROM POLIKLINIK;`);

    str = `${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`
    out = str.split("\n")
    for (let i = 0; i < out.length; i++) {
        out[i] = out[i].split("\t")
    }

    await client.end();
    return out;
}

async function getDoctorsByDepartment() {
    const client = await getClient();
    const entries = await client.query(`SELECT p_no, p_isim FROM POLIKLINIK;`);

    var toReturn = {};

    var str = `${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`
    departments = str.split("\n")
    for (let i = 0; i < departments.length; i++) {
        departments[i] = departments[i].split("\t")
    }

    for (let i = 0; i < departments.length; i++) {
        p_no = departments[i][0];
        var doktorsEntry = await client.query(`Select ad || ' ' || soyad From Doktor where p_no = '${p_no}'`);
        var doktorsStr = `${doktorsEntry.rows.map((r) => Object.values(r).join('\t')).join('\n')}`;
        var doktorArr = doktorsStr.split("\n");
        toReturn[departments[i][1]] = doktorArr;
    }

    await client.end();
    return toReturn;
}

async function getAppointmentsOfPatient(tc) {
    const client = await getClient();
    const entries = await client.query(`SELECT * FROM Randevu WHERE hasta_tc = '${tc}';`);

    str = `${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`;
    out = str.split("\n");
    for (let i = 0; i < out.length; i++) {
        out[i] = out[i].split("\t");
    }

    await client.end();
    return out;
}

async function getSickReportsOfPatient(tc) {
    const client = await getClient();
    const entries = await client.query(`SELECT b_no FROM Randevu WHERE hasta_tc = '${tc}' and not b_no is null;`);

    toReturn = [];

    str = `${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`;
    b_nos = str.split("\n");

    for (let i = 0; i < b_nos.length; i++) {
        var entry = await client.query(`SELECT * FROM Rapor WHERE b_no = '${b_nos[i]}';`);
        var reportStr = `${entry.rows.map((r) => Object.values(r).join('\t')).join('\n')}`;
        report = reportStr.split("\n");
        arr = report[0].split("\t");
        if (arr[0] != '')
            toReturn.push(arr);
    }

    await client.end();
    return toReturn;
}

async function getPrescriptionsOfPatient(tc) {
    const client = await getClient();
    const entries = await client.query(`SELECT b_no FROM Randevu WHERE hasta_tc = '${tc}' and not b_no is null;`);

    toReturn = [];

    str = `${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`;
    b_nos = str.split("\n");

    for (let i = 0; i < b_nos.length; i++) {
        var entry = await client.query(`SELECT * FROM Recete WHERE b_no = '${b_nos[i]}';`);
        var receteStr = `${entry.rows.map((r) => Object.values(r).join('\t')).join('\n')}`;
        recete = receteStr.split("\n");
        arr = recete[0].split("\t");
        if (arr[0] != '')
            toReturn.push(arr);
    }

    await client.end();
    return toReturn;
}

async function insertAppointment(tc, d_no, b_no, saat, tarih) {
    const client = await getClient();
    r_no = tc.substring(0, 4) + d_no.substring(0, 3) + tarih.substring(5, 7) + tarih.substring(8, 10);
    if (saat != null)
        saat = "'" + saat + "'";
    else
        saat = "NULL";
    if (b_no != null)
        b_no = "'" + b_no + "'";
    else
        b_no = "NULL";
    await client.query(`INSERT INTO Randevu VALUES('${r_no}','${tc}','${d_no}',${b_no},${saat},'${tarih}');`);
    await client.end();
}

async function deleteAppointment(r_no) {
    const client = await getClient();
    await client.query(`DELETE FROM Randevu WHERE r_no = '${r_no}';`);
    await client.end();
}

async function insertPatient(tc, ad, soyad, sigorta, cinsiyet, yas, parola) {
    const client = await getClient();
    var arr = [tc, ad, soyad, sigorta, cinsiyet, parola];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != null) {
            arr[i] = "'" + arr[i] + "'";
        }
        else {
            arr[i] = "NULL";
        }
    }
    if (yas == null) {
        yas = "NULL";
    }

    await client.query(`INSERT INTO Hasta VALUES(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]}, ${arr[4]}, ${yas}, ${arr[5]});`);
    await client.end();
}

async function deletePatient(tc) {
    const client = await getClient();
    await client.query(`DELETE FROM Hasta Where tc_no = '${tc}'`);
    await client.end();
}

async function getPasswordOfPatient(tc) {
    const client = await getClient();
    const entries = await client.query(`SELECT parola FROM hasta WHERE tc_no = '${tc}';`);

    var str = `${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`;
    await client.end();
    return str;
}

//DEMO
 var a = 5;
(async () => {
    //insertPatient("47382048362", "Omer", "Davarci", "SGK", "E", 20, "12312312312");
    //var a = await getPasswordOfPatient("12312312344");
    a = await getPatientsName();
    //var a = await getDoctorsByDepartment();
    //console.log(a);

   // window.localStorage.setItem("myObject", JSON.stringify(a[0]));

})();

//console.log(obj);