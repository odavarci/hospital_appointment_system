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