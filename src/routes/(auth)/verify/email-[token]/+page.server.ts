import { getUserByToken, updateUser } from '$lib/server/database/actions/users';
import { fail } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/server/emails/templates';
import type { User } from 'lucia';

export async function load({ params }) {
	try {
		const token = params.token as string;
		const user: User | null = await getUserByToken(token);

		if (!user) {
			return fail(500, { error: 'User not found' });
		}

		let heading = 'Email Verification Problem';
		let message =
			'Your email could not be verified. Please contact support if you feel this is an error.';

		if (user) {
			sendWelcomeEmail(user.email);
			heading = 'Je email is geverifieerd';
			message =
				'Je kunt nu hier <a href="/sign-in" class="underline">inloggen</a>';
			await updateUser(user.id, { emailVerified: true });
		}
		return { heading, message };
	} catch (e) {
		return fail(500, { error: e });
	}
}
