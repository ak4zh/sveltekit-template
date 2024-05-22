import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { lucia } from '$lib/server/lucia';
import * as m from "$paraglide/messages.js"

export const actions = {
	default: async (event) => {
		if (!event.locals.user) redirect(302, '/login');
		if (event.locals.session) {
			await lucia.invalidateSession(event.locals.session.id);
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			const message = { type: 'success', message: m.logout_successful() } as const;
			setFlash(message, event);
			redirect(302, '/login', message, event.cookies);
		}
		redirect(302, '/login');
	}
};
