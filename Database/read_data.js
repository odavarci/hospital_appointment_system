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

module.exports.getDoctorsByDepartment = getDoctorsByDepartment;
