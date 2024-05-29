import type { RequestEvent, ServerLoadEvent } from "@sveltejs/kit";

export const getBaseURL = (event: RequestEvent | ServerLoadEvent ) => 
    `${event.url.protocol}//${event.url.host}`;
