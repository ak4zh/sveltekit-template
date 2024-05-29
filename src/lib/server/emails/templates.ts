import { APP_NAME } from '$lib/constants';
import sendEmail from './client';
import * as m from '$paraglide/messages.js'
import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { getBaseURL } from '$lib/helpers';

// Send an email to verify the user's address
export const sendVerificationEmail = async (
	event: RequestEvent | ServerLoadEvent, email: string, token: string
) => {
	const verifyEmailURL = `${getBaseURL(event)}/verify/email-${token}`;
	const textEmail = m.emails_verification_email_text({ appName: APP_NAME, verifyEmailURL});
	const htmlEmail = m.emails_verification_email_html({appName: APP_NAME, verifyEmailURL});
	const subject = m.emails_verification_email_subject({ appName: APP_NAME});
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to welcome the new user
export const sendWelcomeEmail = async (
	event: RequestEvent | ServerLoadEvent, email: string
) => {
	const loginURL = `${getBaseURL(event)}/login`;
	const textEmail = m.emails_welcome_email_text({ appName: APP_NAME, loginURL });
	const htmlEmail = m.emails_welcome_email_html({ appName: APP_NAME, loginURL });
	const subject = m.emails_welcome_email_subject({appName: APP_NAME});
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to reset the user's password
export const sendPasswordResetEmail = async (event: RequestEvent | ServerLoadEvent, email: string, token: string) => {
	const updatePasswordURL = `${getBaseURL(event)}/password/update-${token}`;
	const textEmail = m.emails_password_reset_email_text({ appName: APP_NAME, updatePasswordURL });
	const htmlEmail = m.emails_password_reset_email_html({ appName: APP_NAME, updatePasswordURL });
	const subject = m.emails_password_reset_email_subject({appName: APP_NAME});
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to confirm the user's password reset
// and also send an email to the user's old email account in case of a hijack attempt
export const updateEmailAddressSuccessEmail = async (
	event: RequestEvent | ServerLoadEvent,
	email: string,
	oldEmail: string,
	token: string
) => {
	//send email to user about email change.
	const textEmailChange = m.emails_email_changed_text({ appName: APP_NAME, oldEmail, email });
	const htmlEmailChange = m.emails_email_changed_html({ appName: APP_NAME, oldEmail, email });
	const subjectChange = m.emails_email_changed_subject({ appName: APP_NAME });
	await sendVerificationEmail(event, email, token);
	await sendEmail(oldEmail, subjectChange, htmlEmailChange, textEmailChange);
};
