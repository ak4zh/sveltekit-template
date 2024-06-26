import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { lucia } from '$lib/server/lucia';
import { Argon2id } from 'oslo/password';
import { getUserByEmail } from '$lib/server/database/actions/users';
import { loginSchema } from '$lib/forms/schemas.js';
import { zod } from 'sveltekit-superforms/adapters';
import * as m from '$paraglide/messages.js';
import { redirectI18n } from '$lib/i18n.js';

export const load = async (event) => {
	if (event.locals.user) redirectI18n(302, '/profile', event);
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
				const validPassword = await new Argon2id().verify(
					existingUser.passwordHash,
					form.data.password
				);
				if (!validPassword) {
					setFlash({ type: 'error', message: m.flash_incorrect_credentials() }, event);
					return setError(form, m.flash_incorrect_credentials());
				} else {
					//password valid - set session
					const session = await lucia.createSession(existingUser.id, {});
					const sessionCookie = lucia.createSessionCookie(session.id);
					event.cookies.set(sessionCookie.name, sessionCookie.value, {
						path: '.',
						...sessionCookie.attributes
					});
					setFlash({ type: 'success', message: m.flash_login_successful() }, event);
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
