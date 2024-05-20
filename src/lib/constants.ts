import { dev } from '$app/environment';
import { PUBLIC_DOMAIN, PUBLIC_EMAIL } from '$env/static/public';
export const DOMAIN = PUBLIC_DOMAIN;
export const BASE_URL = dev ? 'http://localhost:5173' : `https://${DOMAIN}`;
export const APP_NAME = 'Sveltekit Starter';
export const CONTACT_EMAIL = PUBLIC_EMAIL;
/* WARNING!!! TERMS AND CONDITIONS AND PRIVACY POLICY 
WERE CREATED BY CHATGPT AS AN EXAMPLE ONLY. 
CONSULT A LAWYER AND DEVELOP YOUR OWN TERMS AND PRIVACY POLICY!!! */
export const TERMS_PRIVACY_CONTACT_EMAIL = PUBLIC_EMAIL;
export const TERMS_PRIVACY_WEBSITE = DOMAIN;
export const TERMS_PRIVACY_COMPANY = 'Sveltekit Starter';
export const TERMS_PRIVACY_EFFECTIVE_DATE = 'January 1, 2023';
export const TERMS_PRIVACY_APP_NAME = 'Sveltekit Starter';
export const TERMS_PRIVACY_APP_PRICING_AND_SUBSCRIPTIONS =
	'[Details about the pricing, subscription model, refund policy]';
export const TERMS_PRIVACY_COUNTRY = 'Netherlands';
export const DEMO_ACCOUNT_IDS = ["f7a0e6cc-ec0a-40c5-a28c-20322b534c8b", "f87e48b0-a209-4b75-84e7-3156ff897859"]