// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { userTable, sessionTable } from '$lib/server/database/schemas';
import db from '$lib/server/database/client';
import { dev } from '$app/environment';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: !dev
		}
	},
	sessionExpiresIn: new TimeSpan(30, 'd'), // no more active/idle
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			name: attributes.name,
			role: attributes.role,
			email: attributes.email,
			emailVerified: attributes.emailVerified
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		//DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseUserAttributes {
	id: string;
	name: string;
	role: string;
	email: string;
	emailVerified: boolean;
}

/*interface DatabaseSessionAttributes {
	sessionExpiresIn: number;
}*/
