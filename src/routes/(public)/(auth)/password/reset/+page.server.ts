import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { sendPasswordResetEmail } from '$lib/server/emails/templates';
import { getUserByEmail, updateUser } from '$lib/server/database/actions/users';
import { resetPasswordSchema } from '$lib/forms/schemas.js';
import { zod } from 'sveltekit-superforms/adapters';


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
				return setError(form, 'The email address does not have an account.');
			}
			console.log('reset user password');
			const token = crypto.randomUUID();
			await updateUser(user.id, { token: token });
			await sendPasswordResetEmail(form.data.email, token);
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		return redirect(302, '/password/reset/success');
	}
};
