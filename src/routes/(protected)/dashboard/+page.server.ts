import { getUserById } from '$lib/server/database/user-model.js';
import { redirect } from '@sveltejs/kit';
export const load = async (event) => {
	//I only have this function here so it will check page again
	//instead of keeping it cache if it was client side only.
	//If only client side, it might still show the page even
	//if the user has logged out.
	//const session = await event.locals.auth.validate();
	const user = event.locals.user;
	if (!user) redirect(302, 'sign-in');
	const advisor = user.advisorId ? await getUserById(user.advisorId) : ''
	throw redirect(
		302, 
		`https://form.jotform.com/240715181089356?emailAutobedrijf=${user?.email}&naamAutobedrijf78=${user?.company}&contactpersoonAutobedrijf=${user?.name}&uwAdviseur89=${advisor?.name || ''}`
	);
};
