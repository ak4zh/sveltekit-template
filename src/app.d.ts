// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { AvailableLanguageTag } from "$lib/paraglide/runtime.js"

declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			paraglide:  {
				lang: AvailableLanguageTag
				textDirection: "rtl" | "ltr"
			};
			startTimer: number;
			error: string;
			errorId: string;
			errorStackTrace: string;
			message: unknown;
			track: unknown;
		}
		interface Error {
			code?: string;
			errorId?: string;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
	}
}

export {};
