import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { getUserByEmail } from '$lib/server/database/actions/users';
import { loginSchema } from '$lib/forms/schemas.js';
import { zod } from 'sveltekit-superforms/adapters';
import * as m from '$paraglide/messages.js';
import { redirectI18n } from '$lib/i18n.js';
import { verify } from '@node-rs/argon2';
import * as auth from '$lib/server/auth';

const REDIRECT_URL = '/profile';

export const load = async (event) => {
	if (event.locals.user) redirectI18n(302, REDIRECT_URL, event);
	const form = await superValidate(event, zod(loginSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) return fail(400, { form });

		//add user to db
		try {
			const email = form.data.email.toLowerCase();
			const existingUser = await getUserByEmail(email);
			if (!existingUser) {
				setFlash({ type: 'error', message: m.flash_incorrect_credentials() }, event);
				return setError(form, m.flash_incorrect_credentials());
			}

			if (existingUser.passwordHash) {
				const validPassword = await verify(existingUser.passwordHash, form.data.password, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1
				});
				if (!validPassword) {
					setFlash({ type: 'error', message: m.flash_incorrect_credentials() }, event);
					return setError(form, m.flash_incorrect_credentials());
				} else {
					const sessionToken = auth.generateSessionToken();
					const session = await auth.createSession(sessionToken, existingUser.id);
					auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
					setFlash({ type: 'success', message: m.flash_login_successful() }, event);
					return redirectI18n(302, REDIRECT_URL, event);
				}
			}
		} catch (e) {
			//TODO: need to return error message to client
			console.error(e);
			// email already in use
			//const { fieldErrors: errors } = e.flatten();
			setFlash({ type: 'error', message: m.flash_incorrect_credentials() }, event);
			return setError(form, m.flash_incorrect_credentials());
		}
		return { form };
	}
};
