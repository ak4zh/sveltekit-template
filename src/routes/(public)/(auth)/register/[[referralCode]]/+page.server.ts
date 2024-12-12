import { setError, superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';
import { createUser, getUserByReferralCode } from '$lib/server/database/actions/users';
import { sendVerificationEmail } from '$lib/server/emails/templates';
import { signUpSchema } from '$lib/forms/schemas';
import { CAN_SEND_EMAILS } from '$lib/server/emails/client';
import * as m from '$paraglide/messages.js';
import { redirectI18n } from '$lib/i18n.js';
import { hash } from '@node-rs/argon2';
import * as auth from '$lib/server/auth';

export const load = async (event) => {
	if (event.locals.user) redirectI18n(302, '/profile', event);
	const form = await superValidate(event, zod(signUpSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signUpSchema));
		if (!form.valid) return fail(400, { form });
		try {
			const passwordHash = await hash(form.data.password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			const parent = event.params.referralCode
				? await getUserByReferralCode(event.params.referralCode)
				: null;
			const user = {
				username: form.data.username.toLowerCase(),
				email: form.data.email.toLowerCase(),
				name: form.data.name,
				passwordHash,
				parentId: parent?.id,
				emailVerified: CAN_SEND_EMAILS ? false : true
			};
			const newUser = await createUser(user);
			if (!newUser) throw Error('User already exists');
			await sendVerificationEmail(event, newUser.email, newUser.token);
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, newUser.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
			setFlash(
				{
					type: 'success',
					message: m.flash_account_created_check_email()
				},
				event
			);
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: m.flash_failed_to_create_account() }, event);
			// email already in use
			// might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'email', m.flash_email_already_exists());
		}
		return { form };
	}
};
