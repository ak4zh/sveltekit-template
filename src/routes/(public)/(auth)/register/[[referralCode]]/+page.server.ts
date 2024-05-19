import { redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { fail } from "@sveltejs/kit";
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/lucia';
import { createUser, getUserByInviteCode } from '$lib/server/database/actions/users';
import { nanoid } from 'nanoid';
import { sendVerificationEmail } from '$lib/server/emails/templates';
import { signUpSchema } from '$lib/forms/schemas.js';


export const load = async (event) => {
	if (event.locals.user) redirect(302, '/profile');
	const form = await superValidate(event, zod(signUpSchema));
	return { form };
};

export const actions = {
	default: async ({ request, params, cookies }) => {
		const form = await superValidate(request, zod(signUpSchema));
		console.log(form)
		if (!form.valid) return fail(400, { form })
		try {
			const parent = params.referralCode
				? await getUserByInviteCode(params.referralCode)
				: null
			const token = crypto.randomUUID();
			const user = {
				email: form.data.email.toLowerCase(),
				name: form.data.name,
				passwordHash: await new Argon2id().hash(form.data.password),
				token,
				referralCode: nanoid(7),
				createdAt: new Date(),
				updatedAt: new Date(),
				parentId: parent?.id
			};
			const newUser = await createUser(user);
			if (!newUser) throw Error("User already exists")
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
					message: 'Account created. Please check your email to verify your account.'
				},
				cookies
			);
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Account was not able to be created.' }, cookies);
			// email already in use
			// might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'email', 'A user with that email already exists.');
		}
		return { form };
	}
};
