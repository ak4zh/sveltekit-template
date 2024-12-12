import { setFlash } from 'sveltekit-flash-message/server';
import { redirectI18n } from '$lib/i18n.js';
import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session) {
			await auth.invalidateSession(event.locals.session.id);
			auth.deleteSessionTokenCookie(event);
			const message = { type: 'success', message: m.logout_successful() } as const;
			setFlash(message, event);
		}
		redirectI18n(302, '/login', event);
	}
};
