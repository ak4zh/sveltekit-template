import { redirectI18n } from '$lib/i18n';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
	const user = event.locals.user;
	if (!user) return redirectI18n(302, '/login', event);
	return { user };
});
