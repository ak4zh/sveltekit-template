import { BASE_URL, APP_NAME } from '$lib/constants';
import sendEmail from './client';

// Send an email to verify the user's address
export const sendVerificationEmail = async (email: string, token: string) => {
	const verifyEmailURL = `${BASE_URL}/verify/email-${token}`;
	const textEmail = `Please visit the link below to verify your email address for your ${APP_NAME} account.\n\n  
    ${verifyEmailURL} \n\nIf you did not create this account, you can disregard this email.`;
	const htmlEmail = `<p>Klik op deze <a href="${verifyEmailURL}">link</a> om je emailadres voor jouw ${APP_NAME} account te verifiëren.</p>  <p>Je kunt ook klikken op onderstaande link.</p><p>${verifyEmailURL}</p><p>Als jij deze account niet hebt aangemaakt, kun je deze mail negeren.</p>`;
	const subject = `Verifieer je emailadres voor ${APP_NAME}`;
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to welcome the new user
export const sendWelcomeEmail = async (email: string) => {
	const textEmail = `Dank voor het verifiëren van je emailadres bij ${APP_NAME}.\nJe kunt nu hier inloggen in je account.\n\n${BASE_URL}/login`;
	const htmlEmail = `<p>Dank voor het verifiëren van je emailadres bij ${APP_NAME}.</p><p>Je kunt nu hier <a href="${BASE_URL}/login">inloggen</a> in je account.</p>`;
	const subject = `Welcome to ${APP_NAME}`;
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to reset the user's password
export const sendPasswordResetEmail = async (email: string, token: string) => {
	const updatePasswordURL = `${BASE_URL}/password/update-${token}`;
	const textEmail = `Please visit the link below to change your password for ${APP_NAME}.\n\n  
    ${updatePasswordURL} \n\nIf you did not request to change your password, you can disregard this email.`;
	const htmlEmail = `<p>Please click this <a href="${updatePasswordURL}">link</a> to change your password for ${APP_NAME}.</p>  
	<p>You can also visit the link below.</p><p>${updatePasswordURL}</p><p>If you did not request to change your password, you can disregard this email.</p>`;
	const subject = `Change your password for ${APP_NAME}`;
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
	const verifyEmailURL = `${BASE_URL}/verify/email-${token}`;
	const textEmail = `Dank voor het verifiëren van je emailadres bij ${APP_NAME}.\nJe kunt nu hier inloggen in je account.\n\n${BASE_URL}/login`;
	const htmlEmail = `<p>Klik op deze <a href="${verifyEmailURL}">link</a> om je emailadres voor jouw ${APP_NAME} account te verifiëren.</p>  <p>Je kunt ook klikken op onderstaande link.</p><p>${verifyEmailURL}</p><p>Als jij deze account niet hebt aangemaakt, kun je deze mail negeren.</p>`;
	const subject = `Verifieer je emailadres voor ${APP_NAME}`;
	await sendEmail(email, subject, htmlEmail, textEmail);

	//send email to user about email change.
	const textEmailChange = `Your ${APP_NAME} account email has been updated from ${oldEmail} to ${email}.  If you DID NOT request this change, please contact support at: ${BASE_URL}/ to revert the changes.`;
	const htmlEmailChange = `<p>Your ${APP_NAME} account email has been updated from ${oldEmail} to ${email}.</p><p>If you DID NOT request this change, please contact support at: <a href='${BASE_URL}/'>${BASE_URL}/</a> to revert the changes.</p>`;
	const subjectChange = `Your email address for ${APP_NAME} has changed.`;
	await sendEmail(oldEmail, subjectChange, htmlEmailChange, textEmailChange);
};
