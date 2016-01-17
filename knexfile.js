require('dotenv').load();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DB_CONNECTION,
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
