import { BASE_URL, APP_NAME } from '$lib/constants';
import sendEmail from './client';
import * as m from '$paraglide/messages.js'

// Send an email to verify the user's address
export const sendVerificationEmail = async (email: string, token: string) => {
	const verifyEmailURL = `${BASE_URL}/verify/email-${token}`;
	const textEmail = m.emails_verification_email_text({ appName: APP_NAME, verifyEmailURL});
	const htmlEmail = m.emails_verification_email_html({appName: APP_NAME, verifyEmailURL});
	const subject = m.emails_verification_email_subject();
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to welcome the new user
export const sendWelcomeEmail = async (email: string) => {
	const loginURL = `${BASE_URL}/login`;
	const textEmail = m.emails_welcome_email_text({ appName: APP_NAME, loginURL });
	const htmlEmail = m.emails_welcome_email_html({ appName: APP_NAME, loginURL });
	const subject = m.emails_welcome_email_subject({appName: APP_NAME});
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to reset the user's password
export const sendPasswordResetEmail = async (email: string, token: string) => {
	const updatePasswordURL = `${BASE_URL}/password/update-${token}`;
	const textEmail = m.emails_password_reset_email_text({ appName: APP_NAME, updatePasswordURL });
	const htmlEmail = m.emails_password_reset_email_html({ appName: APP_NAME, updatePasswordURL });
	const subject = m.emails_password_reset_email_subject({appName: APP_NAME});
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to confirm the user's password reset
// and also send an email to the user's old email account in case of a hijack attempt
export const updateEmailAddressSuccessEmail = async (
	email: string,
	oldEmail: string,
	token: string
) => {
	//send email to user about email change.
	const textEmailChange = m.emails_email_changed_text({ appName: APP_NAME, oldEmail, email });
	const htmlEmailChange = m.emails_email_changed_html({ appName: APP_NAME, oldEmail, email });
	const subjectChange = m.emails_email_changed_subject({ appName: APP_NAME });
	await sendVerificationEmail(email, token);
	await sendEmail(oldEmail, subjectChange, htmlEmailChange, textEmailChange);
};
