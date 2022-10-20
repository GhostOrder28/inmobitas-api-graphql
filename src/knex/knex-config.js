const knexMain = require('knex')({
  client: 'pg',
  connection: process.env.POSTGRES_CONNECTION_STRING || {
    host : '127.0.0.1',
    port : 5432,
    user : 'ghost',
    database : 'inmobitas'
  } 
});

const knexGuest = require('knex')({
  client: 'pg',
  connection: process.env.POSTGRES_GUEST_CONNECTION_STRING
});

module.exports = {
  knexMain,
  knexGuest
}
