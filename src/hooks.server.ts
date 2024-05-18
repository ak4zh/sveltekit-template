import { lucia } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
// import { faker } from "@faker-js/faker";
// import { nanoid } from 'nanoid';
// import { Argon2id } from 'oslo/password';
// import { userTable } from '$lib/server/database/schemas';
// import db from '$lib/server/database/client';
// const data: (typeof userTable.$inferInsert)[] = [];
// for (let i = 0; i < 200; i++) {
// 	data.push({
// 		name: faker.person.fullName(),
// 		email: faker.internet.email(),
// 		referralCode: nanoid(7),
// 		passwordHash: await new Argon2id().hash(faker.internet.password()),
// 		token: crypto.randomUUID(),
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 	});
// }    
// await db.insert(userTable).values(data);

export const handle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	};

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	};
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	};
	event.locals.user = user;
	event.locals.session = session;


	if (event.route.id?.startsWith('/(protected)')) {
		if (!user) redirect(302, '/login');
		if (!user.emailVerified) redirect(302, '/verify/email');
	};
	if (event.route.id?.startsWith('/(protected)/(admin)')) {
		if (user?.role !== 'ADMIN') redirect(302, '/profile');
	};
	const response = await resolve(event);
	return response;
};
