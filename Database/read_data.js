const { getClient } = require('./get-client');

async function getPatientsName()
{
    const client = await getClient();
    const entries = await client.query(`SELECT Ad, Soyad FROM HASTA;`);

    str = `${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`
    out = str.split("\n")
    for (let i = 0; i < out.length; i++)
    {
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
        if(arr[0] != '')
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
    console.log(arr);
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

    await client.query(`INSERT INTO Hasta VALUES(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]}, ${arr[4]}, ${yas}), ${arr[5]};`);
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

(async () => {
    //insertPatient("00000000000", "Omer", "Davarci", "SGK", "E", 20, "00000000000");
    //var a = getPasswordOfPatient("12312312344");
    //var a = getPatientsName();
    //var a = getDoctorsByDepartment();

    a.then(function () {
        console.log(a);
    })
})();

module.exports.getPatientsName = getPatientsName;
module.exports.getDepartmentName = getDepartmentName;
module.exports.getAppointmentsOfPatient = getAppointmentsOfPatient;
module.exports.getSickReportsOfPatient = getSickReportsOfPatient;
module.exports.getPrescriptionsOfPatient = getPrescriptionsOfPatient;
module.exports.getDoctorsByDepartment = getDoctorsByDepartment;
module.exports.insertAppointment = insertAppointment;
module.exports.deleteAppointment = deleteAppointment;
module.exports.insertPatient = insertPatient;
module.exports.deletePatient = deletePatient;
module.exports.getPasswordOfPatient = getPasswordOfPatient;