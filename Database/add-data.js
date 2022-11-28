const { getClient } = require('./get-client');

(async () => {
    const client = await getClient();
    var tc = "12312312344", name = "Osman", lname = "Fake", insurance = "SSK", sex = "M", age = 55;
    let insertRow = await client.query(`INSERT INTO HASTA VALUES('${tc}', '${name}', '${lname}', '${insurance}', '${sex}', ${age});`);
    console.log(`Inserted ${insertRow.rowCount} row`);
    await client.end();
})();