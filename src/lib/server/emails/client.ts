import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import { FROM_EMAIL } from '$env/static/private';
import { dev } from '$app/environment';

const haveSMTP = env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS;

const transporter = nodemailer.createTransport({
	auth: {
		pass: env.SMTP_PASS,
		user: env.SMTP_USER
	},
	host: env.SMTP_HOST,
	port: Number(env.SMTP_PORT),
	secure: Number(env.SMTP_SECURE) === 1
});
//import { z } from "zod";
export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	const mailOptions = {
		from: FROM_EMAIL,
		to: email,
		subject: subject,
		html: bodyHtml,
		text: bodyText
	};
	if (!mailOptions.text) delete mailOptions.text;
	if (!mailOptions.html) delete mailOptions.html;
	try {
		if (dev || !haveSMTP) {
			console.log(mailOptions);
		} else {
			transporter.sendMail(mailOptions, (err) => {
				if (err) {
					throw new Error(`Error sending email: ${JSON.stringify(err)}`);
				}
			});
		}
		console.log('E-mail sent successfully!');
		return {
			statusCode: 200,
			message: 'E-mail sent successfully.'
		};
	} catch (error) {
		throw new Error(`Error sending email: ${JSON.stringify(error)}`);
	}
}
