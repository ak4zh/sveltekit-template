import { DATABASE_URL } from '$env/static/private';
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({ connectionString: DATABASE_URL });
await client.connect();
const db = drizzle(client);
export default db;
