import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { sendPasswordResetEmail } from '$lib/server/emails/templates';
import { getUserByEmail, updateUser } from '$lib/server/database/actions/users';
import { resetPasswordSchema } from '$lib/forms/schemas.js';
import { zod } from 'sveltekit-superforms/adapters';
import * as m from "$paraglide/messages.js"
import { setFlash } from 'sveltekit-flash-message/server';
import { redirectI18n } from '$lib/i18n.js';

export const load = async (event) => {
	const form = await superValidate(event, zod(resetPasswordSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(resetPasswordSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const user = await getUserByEmail(form.data.email);
			if (!user) {
				return setError(form, m.account_not_found());
			}
			console.log('reset user password');
			const token = crypto.randomUUID();
			await updateUser(user.id, { token: token });
			await sendPasswordResetEmail(form.data.email, token);
			setFlash({ type: 'success', message: m.flash_password_update_successful()}, event)
		} catch (e) {
			console.error(e);
			return setError(
				form,
				m.password_reset_error()
			);
		}
		return redirectI18n(302, '/password/reset/success', event);
	}
};
