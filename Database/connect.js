const { Client } = require('pg');
require('dotenv').config();

(async () => {
    const client = new Client({
        host: "localhost",
        port: "5432",
        user: "postgres",
        password: "mklp%123",
        database: "372",
        ssl: false,
    });
    await client.connect();
    const res = await client.query('SELECT $1::text as connected', ['Connection to postgres successful!']);
    console.log(res.rows[0].connected);
    await client.end();
})();