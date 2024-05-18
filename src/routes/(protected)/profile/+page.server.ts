import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { setFlash } from 'sveltekit-flash-message/server';
import { userUpdateSchema } from '$lib/forms/schemas';
import { updateEmailAddressSuccessEmail } from '$lib/server/emails/templates';
import { updateUser } from '$lib/server/database/actions/users';
import type { UpdateUser } from '$lib/server/database/schemas';
import { zod } from 'sveltekit-superforms/adapters';


export const load = async (event) => {
	const form = await superValidate(event, zod(userUpdateSchema));
	const user = event.locals.user;

	if (!user) {
		return fail(400, {
			form,
			error: 'You must be signed in to view this page.'
		});
	}
	form.data = {
		name: user?.name,
		email: user?.email,
	};
	return { 
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(userUpdateSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const user = event.locals.user;
			if (user) {
				const newEmail = user?.email !== form.data.email;
				const updatedData: UpdateUser = {
					name: form.data.name,
					email: form.data.email,
					updatedAt: new Date()
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
	}
};
