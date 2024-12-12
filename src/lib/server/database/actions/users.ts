import { and, asc, desc, eq, ilike, not, sql, type AnyColumn } from 'drizzle-orm';
import { db } from '$lib/server/database/client';
import * as table from '$lib/server/database/schemas';
import { encodeBase32LowerCase } from '@oslojs/encoding';
// import { alias } from 'drizzle-orm/pg-core';

// const parent = alias(table.users, "parent")
export type UserFilters = {
	name?: string;
	role?: 'ADMIN' | 'USER';
	email?: string;
	search?: string;
	limit?: string;
	page?: string;
	sort?: string;
	order?: string;
};

const filtersToConditions = async (
	userFilters: UserFilters,
	userId: string | undefined = undefined
) => {
	const conditions = [];
	if (userId) conditions.push(eq(table.users.parentId, userId));
	if (userFilters.name) conditions.push(ilike(table.users.name, `%${userFilters.name}%`));
	if (userFilters.email) conditions.push(ilike(table.users.email, `%${userFilters.email}%`));
	if (userFilters.role) conditions.push(eq(table.users.role, userFilters.role.toUpperCase()));
	return conditions;
};
const getUsersQuery = async (userFilters: UserFilters, userId: string | undefined = undefined) => {
	const sortableColumns: { [key: string]: AnyColumn } = {
		name: table.users.name,
		email: table.users.email,
		role: table.users.role
	};
	const page = Number(userFilters.page) || 1;
	const limit = Math.min(Number(userFilters.limit) || 10, 50);
	const offset = (page - 1) * limit;
	const query = db
		.select({
			id: table.users.id,
			name: table.users.name,
			email: table.users.email,
			referralCode: table.users.referralCode,
			role: table.users.role,
			emailVerified: table.users.emailVerified
		})
		.from(table.users);
	const countQuery = db.select({ count: sql`count(*)`.mapWith(Number) }).from(table.users);
	const conditions = await filtersToConditions(userFilters, userId);
	if (userFilters.order && userFilters.sort && userFilters.sort in sortableColumns) {
		const colName = sortableColumns[userFilters.sort];
		query.orderBy(userFilters.order === 'asc' ? asc(colName) : desc(colName));
	} else {
		query.orderBy(asc(table.users.serial));
	}
	const [total, filtered, users] = await Promise.all([
		db.select({ count: sql`count(*)`.mapWith(Number) }).from(table.users),
		countQuery.where(and(...conditions)),
		query
			.where(and(...conditions))
			.limit(limit)
			.offset(offset)
	]);
	return { users, count: filtered?.[0]?.count, total: total?.[0]?.count };
};

export const getUsers = async (userFilters: UserFilters) => await getUsersQuery(userFilters);
export const getMyUsers = async (userFilters: UserFilters, userId: string) =>
	await getUsersQuery(userFilters, userId);

export const countUsers = async () => {
	return await db.select({ count: sql`count(*)`.mapWith(Number) }).from(table.users);
};

export const getUserByReferralCode = async (referralCode: string) => {
	const user = await db.select().from(table.users).where(eq(table.users.referralCode, referralCode));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const getInsiders = async () => {
	return await db
		.select({
			label: table.users.name,
			value: table.users.id
		})
		.from(table.users)
		.where(not(eq(table.users.role, 'USER')))
		.orderBy(asc(table.users.serial));
};

export const getUsersByRole = async (role: 'ADMIN' | 'USER') => {
	const user = await db
		.select()
		.from(table.users)
		.where(eq(table.users.role, role))
		.orderBy(asc(table.users.serial));
	if (user.length === 0) {
		return null;
	} else {
		return user;
	}
};
export const getUserById = async (id: string) => {
	const user = await db.select().from(table.users).where(eq(table.users.id, id));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};
export const getUserByEmail = async (email: string) => {
	const user = await db.select().from(table.users).where(eq(table.users.email, email));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const getUserByToken = async (token: string) => {
	const user = await db.select().from(table.users).where(eq(table.users.token, token));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const updateUser = async (id: string, user: table.UserUpdate) => {
	const result = await db.update(table.users).set(user).where(eq(table.users.id, id)).returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const createUser = async (user: table.UserNew) => {
	const result = await db.insert(table.users).values(user).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const deleteUser = async (id: string) => {
	await db.delete(table.sessions).where(eq(table.sessions.userId, id));
	return await db.delete(table.users).where(eq(table.users.id, id));
};
