import * as auth from '$lib/server/auth.js';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n, redirectI18n } from '$lib/i18n';
import type { RequestEvent, Handle } from '@sveltejs/kit';

const isPublicRoute = (event: RequestEvent) => event.route.id?.startsWith('/(public)');
const isPrivateRoute = (event: RequestEvent) => event.route.id?.startsWith('/(private)');
const isAdminRoute = (event: RequestEvent) => event.route.id?.startsWith('/(private)/(admin)');

const dashboardURL = '/profile';
const loginURL = '/login';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handleAuthRedirect: Handle = async ({ event, resolve }) => {
	const user = event.locals.user;
	if (isPublicRoute(event)) {
		if (user) return redirectI18n(302, dashboardURL, event);
		return resolve(event);
	}
	if (!user) return redirectI18n(302, loginURL, event);
	// if (isPrivateRoute(event)) {
	// 	if (!user.emailVerified) return redirectI18n(302, loginURL, event);
	// }
	if (isAdminRoute(event)) {
		if (user.role !== 'ADMIN') return redirectI18n(302, dashboardURL, event);
	}
	return resolve(event);
};

export const handle = sequence(i18n.handle(), handleAuth, handleAuthRedirect);
