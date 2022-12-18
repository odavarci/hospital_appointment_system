const { getClient } = require('./get-client');

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

(async () => {
    //insertPatient("00000000000", "Omer", "Davarci", "SGK", "E", 20, "00000000000");
    //var a = getPasswordOfPatient("12312312344");
    //var a = getPatientsName();
    //var a = getDoctorsByDepartment();
    var a = await getPatientsName();

    a.then(function () {
        console.log(a);
    })
})();