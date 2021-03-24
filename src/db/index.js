const { Pool } = require('pg')
const pool = new Pool({
  host: '54.193.99.242',
  database: 'qadb',
  user: 'postgres',
  port: 80,
  password: '123',
  // host: 'localhost',
  // database: 'qadb',
  // user: 'jackzhen',
  // port: 5432,
  // password: null,

});

module.exports = {
  query(text, params) {
    return pool.query(text, params)
  },
}