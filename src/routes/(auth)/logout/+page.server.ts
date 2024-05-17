import { redirect } from 'sveltekit-flash-message/server';
import { lucia } from '$lib/server/lucia';

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
			const message = { type: 'success', message: 'Logged out' } as const;
			redirect(302, '/login', message, event.cookies);
		}
		redirect(302, '/login');
	}
};
