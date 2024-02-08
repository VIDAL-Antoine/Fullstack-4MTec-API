import dotenv from 'dotenv';

dotenv.config();

export const port = Number(process.env.API_PORT);

export const db_host = String(process.env.POSTGRES_HOST);
export const db_port = Number(process.env.POSTGRES_PORT);
export const db_name = String(process.env.POSTGRES_DB);
export const db_user = String(process.env.POSTGRES_USER);
export const db_password = String(process.env.POSTGRES_PASSWORD);
