import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { userUpdatePasswordSchema } from '$lib/forms/schemas';
import { getUserByToken, updateUser } from '$lib/server/database/actions/users';
import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { redirectI18n } from '$lib/i18n.js';

export const load = async (event) => {
	const form = await superValidate(event, zod(userUpdatePasswordSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(userUpdatePasswordSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const token = event.params.token as string;
			console.log('update user password');
			const newToken = crypto.randomUUID();
			//get email from token
			const user = await getUserByToken(token);

			if (user) {
				const password = await new Argon2id().hash(form.data.password);
				// need to update with new token because token is also used for verification
				// and needs a new verification token in case user has not verified their account
				// and already forgot their password before verifying. Now they can get a new one resent.
				await updateUser(user.id, { token: newToken, passwordHash: password });
			} else {
				return setError(
					form,
					'Email address not found for this token. Please contact support if you need further help.'
				);
			}
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		const token = event.params.token as string;
		redirectI18n(302, `/password/update-${token}/success`, event);
		//		return { form };
	}
};
