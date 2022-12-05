const { Client } = require('pg');
require('dotenv').config();

module.exports.getClient = async () => {
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
};