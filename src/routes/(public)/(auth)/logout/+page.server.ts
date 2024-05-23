import { setFlash } from 'sveltekit-flash-message/server';
import { lucia } from '$lib/server/lucia';
import * as m from "$paraglide/messages.js"
import { redirectI18n } from '$lib/i18n.js';

export const actions = {
	default: async (event) => {
		if (!event.locals.user) redirectI18n(302, '/login', event);
		if (event.locals.session) {
			await lucia.invalidateSession(event.locals.session.id);
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			const message = { type: 'success', message: m.logout_successful() } as const;
			setFlash(message, event);
			redirectI18n(302, '/login', event);
		}
		redirectI18n(302, '/login', event);
	}
};
