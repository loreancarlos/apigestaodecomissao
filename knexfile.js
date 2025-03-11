import config from 'dotenv/config';

export default {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    }
  },
  migrations: {
    directory: './src/database/migrations',
    extension: 'js',
  },
  pool: {
    min: 2,
    max: 10,
  },
  useNullAsDefault: true,
  debug: false
};