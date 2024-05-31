import { userUpdateByAdminSchema, userDeleteSchema } from '$lib/forms/schemas';
import {
	deleteUser,
	getMyUsers,
	getUserById,
	getUsers,
	updateUser,
	type UserFilters
} from '$lib/server/database/actions/users';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate, message } from 'sveltekit-superforms/server';
import { updateEmailAddressSuccessEmail } from '$lib/server/emails/templates';
import { zod } from 'sveltekit-superforms/adapters';
import type { UpdateUser } from '$lib/server/database/schemas.js';
import { DEMO_ACCOUNT_IDS } from '$lib/constants.js';
import * as m from '$paraglide/messages.js';
import { redirectI18n } from '$lib/i18n.js';

export const load = async (event) => {
	const form = await superValidate(event, zod(userUpdateByAdminSchema));
	const deleteForm = await superValidate(event, zod(userDeleteSchema));
	const user = event.locals.user;
	// this can be used if there are multiple ADMIN like roles
	const userFilters = Object.fromEntries(event.url.searchParams) as UserFilters;
	const result =
		user?.role === 'ADMIN'
			? await getUsers(userFilters)
			: await getMyUsers(userFilters, user?.id);
	return {
		...result,
		form,
		deleteForm
	};
};

export const actions = {
	delete: async (event) => {
		const deleteForm = await superValidate(event, zod(userDeleteSchema));
		if (!deleteForm.valid) return fail(400, { deleteForm });
		const user = event.locals.user;
		if (DEMO_ACCOUNT_IDS.includes(deleteForm.data.id)) {
			setFlash({ type: 'error', message: 'Cannot delete demo accounts!' }, event);
			return fail(400, { deleteForm });
		}
		if (user?.id === deleteForm.data.id) {
			setFlash({ type: 'error', message: m.cannot_delete_own_account() }, event);
			return fail(400, { deleteForm });
		}
		try {
			await deleteUser(deleteForm.data.id);
			setFlash({ type: 'success', message: m.user_deleted_successfully() }, event);
		} catch (err) {
			console.log(err);
		}
		return message(deleteForm, m.user_deleted_successfully());
	},
	update: async (event) => {
		const form = await superValidate(event, zod(userUpdateByAdminSchema));
		if (!form.valid) return fail(400, { form });
		if (DEMO_ACCOUNT_IDS.includes(form.data.id)) {
			setFlash({ type: 'error', message: 'Cannot modify demo accounts!' }, event);
			return fail(400, { form });
		}
		try {
			const user = await getUserById(form.data.id);
			if (user) {
				const newEmail = user?.email.toLowerCase() !== form.data.email.toLowerCase();
				console.log('updating user...');
				const updatedData: UpdateUser = {
					name: form.data.name,
					email: form.data.email,
					role: form.data.role
				};
				if (newEmail) {
					const token = crypto.randomUUID();
					updatedData.emailVerified = false;
					updatedData.token = token;
					await updateUser(user.id, updatedData);
					await updateEmailAddressSuccessEmail(
						event,
						form.data.email,
						user?.email,
						token
					);
				} else {
					await updateUser(user.id, updatedData);
				}
				setFlash({ type: 'success', message: m.user_update_successful() }, event);
			}
		} catch (e) {
			console.error(e);
			return setError(form, m.user_update_error());
		}
		console.log('User updated successfully');
		return message(form, m.user_update_successful());
	}
};
