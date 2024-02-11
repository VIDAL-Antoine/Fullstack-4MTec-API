import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const generateJWTSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const port = Number(process.env.API_PORT);

export const db_host = String(process.env.POSTGRES_HOST);
export const db_port = Number(process.env.POSTGRES_PORT);
export const db_name = String(process.env.POSTGRES_DB);
export const db_user = String(process.env.POSTGRES_USER);
export const db_password = String(process.env.POSTGRES_PASSWORD);
export const jwt_secret_key = String(process.env.JWT_SECRET_KEY || generateJWTSecret());
