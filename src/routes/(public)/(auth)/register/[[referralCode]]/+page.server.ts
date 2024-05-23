import { setError, superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/lucia';
import { createUser, getUserByReferralCode } from '$lib/server/database/actions/users';
import { nanoid } from 'nanoid';
import { sendVerificationEmail } from '$lib/server/emails/templates';
import { signUpSchema } from '$lib/forms/schemas';
import { CAN_SEND_EMAILS } from '$lib/server/emails/client';
import * as m from "$paraglide/messages.js"
import { redirectI18n } from '$lib/i18n.js';

export const load = async (event) => {
	if (event.locals.user) redirectI18n(302, '/profile', event);
	const form = await superValidate(event, zod(signUpSchema));
	return { form };
};

export const actions = {
	default: async ({ request, params, cookies }) => {
		const form = await superValidate(request, zod(signUpSchema));
		if (!form.valid) return fail(400, { form });
		try {
			const parent = params.referralCode
				? await getUserByReferralCode(params.referralCode)
				: null;
			const token = crypto.randomUUID();
			const user = {
				email: form.data.email.toLowerCase(),
				name: form.data.name,
				passwordHash: await new Argon2id().hash(form.data.password),
				token,
				referralCode: nanoid(7),
				parentId: parent?.id,
				emailVerified: CAN_SEND_EMAILS ? false : true
			};
			const newUser = await createUser(user);
			if (!newUser) throw Error('User already exists');
			await sendVerificationEmail(newUser.email, token);
			const session = await lucia.createSession(newUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			setFlash(
				{
					type: 'success',
					message: m.flash_account_created_check_email()
				},
				cookies
			);
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: m.flash_failed_to_create_account() }, cookies);
			// email already in use
			// might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'email', m.flash_email_already_exists());
		}
		return { form };
	}
};
