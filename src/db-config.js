require('dotenv').config();
const { Pool, Client } = require('pg');

const database = new Client(process.env.PG_URI);

module.exports = database;