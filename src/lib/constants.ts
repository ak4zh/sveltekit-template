import { dev } from '$app/environment';
import { PUBLIC_DOMAIN, PUBLIC_EMAIL } from '$env/static/public'
export const DOMAIN = PUBLIC_DOMAIN;
export const BASE_URL = dev ? 'http://localhost:5173' : `https://${DOMAIN}`;
export const APP_NAME = 'AlleLeaseDeals';
export const CONTACT_EMAIL = PUBLIC_EMAIL;
/* WARNING!!! TERMS AND CONDITIONS AND PRIVACY POLICY 
WERE CREATED BY CHATGPT AS AN EXAMPLE ONLY. 
CONSULT A LAWYER AND DEVELOP YOUR OWN TERMS AND PRIVACY POLICY!!! */
export const TERMS_PRIVACY_CONTACT_EMAIL = PUBLIC_EMAIL;
export const TERMS_PRIVACY_WEBSITE = DOMAIN;
export const TERMS_PRIVACY_COMPANY = 'AlleLeaseDeals';
export const TERMS_PRIVACY_EFFECTIVE_DATE = 'January 1, 2023';
export const TERMS_PRIVACY_APP_NAME = 'AlleLeaseDeals';
export const TERMS_PRIVACY_APP_PRICING_AND_SUBSCRIPTIONS =
	'[Details about the pricing, subscription model, refund policy]';
export const TERMS_PRIVACY_COUNTRY = 'Netherlands';
