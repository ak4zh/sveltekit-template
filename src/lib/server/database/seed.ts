import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { faker } from '@faker-js/faker';
import postgres from 'postgres';
import { nanoid } from 'nanoid';
import { Argon2id } from 'oslo/password';
import { userTable } from './schemas.ts';
dotenv.config();

if (!('DATABASE_URL' in process.env)) throw new Error('DATABASE_URL not found on .env.development');
const main = async () => {
	const queryClient = postgres(process.env.DATABASE_URL);
	const db = drizzle(queryClient);
	const data: (typeof userTable.$inferInsert)[] = [
		{
			name: 'Admin',
			email: 'admin@example.com',
			passwordHash: await new Argon2id().hash('admin123'),
			token: crypto.randomUUID(),
			referralCode: nanoid(7),
			role: 'ADMIN'
		},
		{
			name: 'Demo',
			email: 'demo@example.com',
			passwordHash: await new Argon2id().hash('demo123'),
			token: crypto.randomUUID(),
			referralCode: nanoid(7)
		}
	];

	for (let i = 0; i < 10; i++) {
		data.push({
			name: faker.person.fullName(),
			email: faker.internet.email().toLowerCase(),
			referralCode: nanoid(7),
			passwordHash: await new Argon2id().hash(faker.internet.password()),
			token: crypto.randomUUID()
		});
	}
	console.log('Seed start');
	await db.insert(userTable).values(data);
	console.log('Seed done');
};

main();
