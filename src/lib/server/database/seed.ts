import { db } from './client';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { Argon2id } from 'oslo/password';
import type { UserNew } from './schemas';
import * as table from './schemas';

const main = async () => {
	const data: UserNew[] = [
		{
			name: 'Admin',
			username: faker.internet.username(),
			email: 'admin@example.com',
			passwordHash: await new Argon2id().hash('admin123'),
			referralCode: nanoid(7),
			role: 'ADMIN'
		},
		{
			name: 'Demo',
			username: faker.internet.username(),
			email: 'demo@example.com',
			passwordHash: await new Argon2id().hash('demo123'),
			referralCode: nanoid(7)
		}
	];

	for (let i = 0; i < 10; i++) {
		data.push({
			name: faker.person.fullName(),
			username: faker.internet.username(),
			email: faker.internet.email().toLowerCase(),
			referralCode: nanoid(7),
			passwordHash: await new Argon2id().hash(faker.internet.password()),
		});
	}
	console.log('Seed start');
	await db.insert(table.users).values(data);
	console.log('Seed done');
};

main();
