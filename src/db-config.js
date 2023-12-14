require('dotenv').config();
const {Pool, Client} = require('pg');

const database = new Client(process.env.PG_URI);

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.PG_URI;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
});

module.exports = {database, pool};
