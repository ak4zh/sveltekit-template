import { redirect } from '@sveltejs/kit';
import { sendVerificationEmail } from '$lib/server/emails/templates';
import { getUserById, updateUser } from '$lib/server/database/actions/users';
import { setFlash } from 'sveltekit-flash-message/server';
import * as m from "$paraglide/messages.js"

export const load = async (event) => {
	if (!event.locals.user) redirect(302, '/login');
};

export const actions = {
	default: async (event) => {
		let user = event.locals.user;
		if (!user) return redirect(302, '/login');
		user = await getUserById(user.id);
		if (!user) return redirect(302, '/login');
		const token = crypto.randomUUID();
		await updateUser(user.id, { emailVerified: false, token });
		await sendVerificationEmail(user.email, token);
		setFlash(
			{
				type: 'success',
				message: m.flash_new_verification_email_sent()
			},
			event
		);
		return { success: true };
	}
};
