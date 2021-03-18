const { Pool } = require('pg')
const pool = new Pool({
  host: 'localhost',
  database: 'qadb',
  port: 5432,
  password: null,
});

module.exports = {
  query(text, params) {
    return pool.query(text, params)
  },
}