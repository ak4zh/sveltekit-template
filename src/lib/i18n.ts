import { createI18n } from '@inlang/paraglide-sveltekit';
import * as runtime from '$lib/paraglide/runtime.js';
import { redirect, type RequestEvent } from '@sveltejs/kit';

export const i18n = createI18n(runtime);

export const redirectI18n = (status: number, path: string, event: RequestEvent) => {
	return redirect(
		status,
		i18n.resolveRoute(
			path,
			event.locals.paraglide.lang as typeof i18n.config.defaultLanguageTag
		)
	);
};
