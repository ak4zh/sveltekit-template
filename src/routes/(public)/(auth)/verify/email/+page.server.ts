import { sendVerificationEmail } from '$lib/server/emails/templates';
import { getUserById, updateUser } from '$lib/server/database/actions/users';
import { setFlash } from 'sveltekit-flash-message/server';
import * as m from "$paraglide/messages.js"
import { redirectI18n } from '$lib/i18n.js';

export const load = async (event) => {
	if (!event.locals.user) redirectI18n(302, '/login', event);
};

export const actions = {
	default: async (event) => {
		let user = event.locals.user;
		if (!user) return redirectI18n(302, '/login', event);
		user = await getUserById(user.id);
		if (!user) return redirectI18n(302, '/login', event);
		const token = crypto.randomUUID();
		await updateUser(user.id, { emailVerified: false, token });
		await sendVerificationEmail(event, user.email, token);
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
