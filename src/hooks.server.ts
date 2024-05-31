import { lucia } from '$lib/server/lucia';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n, redirectI18n } from '$lib/i18n';

export const authHandle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	const { session, user } = sessionId
		? await lucia.validateSession(sessionId)
		: { session: null, user: null };

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
		if (!user) redirectI18n(302, '/login', event);
		if (!user.emailVerified) redirectI18n(302, '/verify/email', event);
	}
	if (event.route.id?.startsWith('/(private)/(admin)')) {
		if (user?.role !== 'ADMIN') redirectI18n(302, '/profile', event);
	}
	const response = await resolve(event);
	return response;
};

export const handle = sequence(i18n.handle(), authHandle);
