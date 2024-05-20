import { env } from '$env/dynamic/private';
export const HAS_SMTP = env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS;