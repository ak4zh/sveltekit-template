import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL not found on .env.development');
export const db = drizzle(DATABASE_URL, { casing: 'snake_case' })
