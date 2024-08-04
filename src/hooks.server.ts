import { lucia } from '$lib/server/lucia';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n, redirectI18n } from '$lib/i18n';
import type { RequestEvent } from '@sveltejs/kit';

const isPublicRoute = (event: RequestEvent) => event.route.id?.startsWith('/(public)');
const isPrivateRoute = (event: RequestEvent) => event.route.id?.startsWith('/(private)');
const isAdminRoute = (event: RequestEvent) => event.route.id?.startsWith('/(private)/(admin)');

const dashboardURL = '/profile';
const loginURL = '/login';

export const sessionHandle: Handle = async ({ event, resolve }) => {
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
	return resolve(event);
};

export const authHandle: Handle = async ({ event, resolve }) => {
	const user = event.locals.user;
	if (isPublicRoute(event)) {
		if (user) return redirectI18n(302, dashboardURL, event);
		return resolve(event)
	};
	if (!user) return redirectI18n(302, loginURL, event);

	if (isPrivateRoute(event)) {
		if (!user.emailVerified) return redirectI18n(302, loginURL, event);
	}
	if (isAdminRoute(event)) {
		if (user.role !== 'ADMIN') return redirectI18n(302, dashboardURL, event);
	}
	return resolve(event);
};

export const handle = sequence(i18n.handle(), sessionHandle, authHandle);
