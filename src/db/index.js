const { Pool } = require('pg')
const pool = new Pool({
// de-coupled EC2 instances set up
// host is connected to node-server EC2, node-server EC2 is connected to postgres EC2 internally
  // host: '54.193.99.242',
  // database: 'qadb',
  // user: 'postgres',
  // port: 80,
  // password: '123',

// local host setup
// for testing npm start in local environment
  // host: 'localhost',
  // database: 'qadb',
  // user: 'jackzhen',
  // port: 5432,
  // password: null,

// docker-compose setup
// postgres image and node-server image in the same network within docker
  host: 'db',
  database: 'qadb',
  user: 'postgres',
  port: 5432,
  password: '123',

});

module.exports = {
  query(text, params) {
    return pool.query(text, params)
  },
}