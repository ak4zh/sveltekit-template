import { drizzle } from 'drizzle-orm/postgres-js';
import { userTable } from './schemas';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import postgres from 'postgres';
import { nanoid } from 'nanoid';
import { Argon2id } from 'oslo/password';

dotenv.config({ path: './.env' });

if (!('DATABASE_URL' in process.env)) throw new Error('DATABASE_URL not found on .env.development');

const main = async () => {
	const queryClient = postgres(DATABASE_URL);
	const db = drizzle(queryClient);
	const data: (typeof users.$inferInsert)[] = [];

	for (let i = 0; i < 20; i++) {
		data.push({
			name: faker.person.fullName(),
			email: faker.internet.email(),
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
