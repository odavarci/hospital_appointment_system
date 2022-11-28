const { getClient } = require('./get-client');

(async () => {
    const client = await getClient();

    var name = 'Osman';
    const entries = await client.query(`SELECT * FROM HASTA WHERE ad = '${name}';`);
    console.log(`Database entries for ${name}: ${entries.rowCount} row(s)`);
    console.log(Object.keys(entries.rows?.[0]).join('\t'));
    console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);
    await client.end();
})();