import { getUserByToken, updateUser } from '$lib/server/database/actions/users';
import { fail } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/server/emails/templates';
import * as m from "$paraglide/messages.js"

export async function load({ params }) {
	try {
		const token = params.token as string;
		const user = await getUserByToken(token);
		if (!user) return fail(500, { error: 'User not found' });
		let heading = m.flash_email_verification_error();
		let message = m.flash_email_cannot_be_verified();
		await sendWelcomeEmail(user.email);
		heading = m.flash_email_verification_successful();
		message = m.flash_email_verification_successful_now_login();
		await updateUser(user.id, { emailVerified: true });
		return { heading, message };
	} catch (e) {
		return fail(500, { error: e });
	}
}
