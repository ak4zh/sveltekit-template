import { lucia } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n'

export const authHandle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	if (event.route.id?.startsWith('/(private)')) {
		if (!user) redirect(302, '/login');
		if (!user.emailVerified) redirect(302, '/verify/email');
	}
	if (event.route.id?.startsWith('/(private)/(admin)')) {
		if (user?.role !== 'ADMIN') redirect(302, '/profile');
	}
	const response = await resolve(event);
	return response;
};

export const handle = sequence(i18n.handle(), authHandle);

