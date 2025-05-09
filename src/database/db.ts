import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();


export const DB : Pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,

  }
});


DB.connect()
  .then(() => console.log('Connected to the PG database'))
  .catch((err: string)=> console.error('Connection error', JSON.stringify(err)));

