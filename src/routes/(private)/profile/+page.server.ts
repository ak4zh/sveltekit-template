import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { setFlash } from 'sveltekit-flash-message/server';
import { userUpdateSchema, userUpdatePasswordSchema } from '$lib/forms/schemas';
import { updateEmailAddressSuccessEmail } from '$lib/server/emails/templates';
import { updateUser } from '$lib/server/database/actions/users';
import type { UpdateUser } from '$lib/server/database/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { Argon2id } from 'oslo/password';

export const load = async (event) => {
	const form = await superValidate(event, zod(userUpdateSchema));
	const passwordUpdateForm = await superValidate(event, zod(userUpdatePasswordSchema));

	const user = event.locals.user;

	if (!user) {
		return fail(400, {
			form,
			error: 'You must be signed in to view this page.'
		});
	}
	form.data = {
		name: user?.name,
		email: user?.email
	};
	return {
		form,
		passwordUpdateForm
	};
};

export const actions = {
	account: async (event) => {
		const form = await superValidate(event, zod(userUpdateSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const user = event.locals.user;
			if (user) {
				const newEmail = user?.email !== form.data.email;
				const updatedData: UpdateUser = {
					name: form.data.name,
					email: form.data.email
				};
				if (newEmail) {
					const token = crypto.randomUUID();
					updatedData.emailVerified = false;
					updatedData.token = token;
					await updateUser(user.id, updatedData);
					await updateEmailAddressSuccessEmail(form.data.email, user?.email, token);
				} else {
					await updateUser(user.id, updatedData);
				}
				setFlash({ type: 'success', message: 'Profile update successful.' }, event);
			}
		} catch (e) {
			console.error(e);
			return setError(form, 'There was a problem updating your profile.');
		}
		return { form };
	},
	password: async (event) => {
		const passwordUpdateForm = await superValidate(event, zod(userUpdatePasswordSchema));
		if (!passwordUpdateForm.valid) return fail(400, { passwordUpdateForm });
		try {
			const newToken = crypto.randomUUID();
			//get email from token
			const user = event.locals.user;
			if (user) {
				const password = await new Argon2id().hash(passwordUpdateForm.data.password);
				// need to update with new token because token is also used for verification
				// and needs a new verification token in case user has not verified their account
				// and already forgot their password before verifying. Now they can get a new one resent.
				await updateUser(user.id, { token: newToken, passwordHash: password });
				setFlash({ type: 'success', message: 'Password update successful.' }, event);
			} else {
				return setError(
					passwordUpdateForm,
					'Something went wrong. Please contact support if you need further help.'
				);
			}
		} catch (e) {
			console.error(e);
			return setError(
				passwordUpdateForm,
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		return { passwordUpdateForm }
	}
};
