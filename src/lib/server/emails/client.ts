import nodemailer from 'nodemailer';
import * as env from '$env/static/private';
import { dev } from '$app/environment';
import * as aws from '@aws-sdk/client-ses';

const hasSESAccessKeys = env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY;
const hasSMTP = env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS;
export const CAN_SEND_EMAILS = hasSESAccessKeys || hasSMTP;

const ses = new aws.SES({
	apiVersion: env.AWS_API_VERSION,
	region: env.AWS_REGION,
	...(hasSESAccessKeys
		? {
				credentials: {
					accessKeyId: env.AWS_ACCESS_KEY_ID || '',
					secretAccessKey: env.AWS_SECRET_ACCESS_KEY || ''
				}
			}
		: {})
});

const transporter = hasSESAccessKeys
	? nodemailer.createTransport({ SES: { ses, aws } })
	: nodemailer.createTransport({
		auth: {
			pass: env.SMTP_PASS,
			user: env.SMTP_USER
		},
		host: env.SMTP_HOST,
		port: Number(env.SMTP_PORT),
		secure: Number(env.SMTP_SECURE) === 1
	});

export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	const mailOptions = {
		from: env.FROM_EMAIL,
		to: email,
		subject: subject,
		html: bodyHtml,
		text: bodyText
	};
	if (!mailOptions.text) delete mailOptions.text;
	if (!mailOptions.html) delete mailOptions.html;
	try {
		if (dev || !CAN_SEND_EMAILS) {
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